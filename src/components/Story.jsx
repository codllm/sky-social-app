import { useEffect, useRef, useState } from "react";
import styles from "../styles/Story.module.css";

import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { supabase } from "../supabase";
import { StoryViewer } from "./StoryViewer";

export const StoryList = () => {

  const fileInputRef = useRef(null);

  const [authDp, setAuthDp] = useState(null);
  const [storyFeed, setStoryFeed] = useState([]);

  const [activeStories, setActiveStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  /* ✅ Fetch logged-in user's profile picture */
  useEffect(() => {
    const fetchDp = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setAuthDp(snap.data().profilepic);
        }
      } catch (err) {
        console.log("DP fetch error:", err.message);
      }
    };

    fetchDp();
  }, []);

  /* ➕ Open file picker */
  const handleAddStoryClick = () => {
    fileInputRef.current.click();
  };

  /* 📁 Story pick */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) uploadStory(file);
  };

  /* ✅ STORY UPLOAD WITH REAL USERNAME FIX */
  const uploadStory = async (storyFile) => {
    const loggedUser = auth.currentUser;
    if (!loggedUser) return;

    try {
      const filepath = `story_${Date.now()}_${loggedUser.uid}`;

      // ⬆ Upload to Supabase
      await supabase.storage.from("story").upload(filepath, storyFile);

      // 🔗 Get public URL
      const { data } = supabase.storage
        .from("story")
        .getPublicUrl(filepath);

      const storyUrl = data.publicUrl;

      // ✅ Get USER DATA from Firestore (SOURCE OF TRUTH)
      const userSnap = await getDoc(doc(db, "users", loggedUser.uid));
      const userData = userSnap.exists() ? userSnap.data() : {};

      const username = userData.username || "User";
      const userPhoto = userData.profilepic || "";

      // ✅ Save story with REAL username
      await addDoc(collection(db, "story"), {
        storyUrl,
        userId: loggedUser.uid,
        username,
        userPhoto,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Story uploaded with true username");

      fetchStories();

    } catch (err) {
      console.log("❌ Story upload failed:", err.message);
    }
  };

  /* 🔥 Load stories from Firestore */
  const fetchStories = async () => {
    try {
      const q = query(collection(db, "story"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const stories = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (story) =>
            story.createdAt &&
            Date.now() - story.createdAt.toMillis() < 24 * 60 * 60 * 1000
        );

      setStoryFeed(stories);

    } catch (err) {
      console.log("❌ Story fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  /* ✅ Show only clicked user's stories */
  const handleStoryClick = (userId) => {
    const filtered = storyFeed.filter(
      (story) => story.userId === userId
    );

    setActiveStories(filtered);
    setCurrentIndex(0);
    setIsViewerOpen(true);
  };

  /* ✅ Detect own stories */
  const currentUserStories = auth.currentUser
    ? storyFeed.filter((s) => s.userId === auth.currentUser.uid)
    : [];

  return (
    <>
      <div className={styles.storyContainer}>

        {/* ✅ YOUR STORY */}
        <div
          className={styles.storyItem}
          onClick={() =>
            currentUserStories.length
              ? handleStoryClick(auth.currentUser.uid)
              : handleAddStoryClick()
          }
        >
          <div className={styles.storyRing}>
            <img
              src={authDp || "https://via.placeholder.com/150"}
              className={styles.storyImage}
              alt="Your story"
            />
          </div>

          {!currentUserStories.length && (
            <div className={styles.addStory}>+</div>
          )}

          <span className={styles.storyName}>Your Story</span>

          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* ✅ OTHER USERS */}
        {storyFeed
          .filter((s) => s.userId !== auth.currentUser?.uid)
          .map((story) => (
            <div
              key={story.id}
              className={styles.storyItem}
              onClick={() => handleStoryClick(story.userId)}
            >
              <div className={styles.storyRing}>
                <img
                  src={story.userPhoto || story.storyUrl}
                  className={styles.storyImage}
                  alt={story.username}
                />
              </div>

              <span className={styles.storyName}>{story.username}</span>
            </div>
          ))}
      </div>

      {/* ✅ STORY VIEWER */}
      {isViewerOpen && (
        <StoryViewer
          stories={activeStories}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          closeViewer={() => setIsViewerOpen(false)}
        />
      )}
    </>
  );
};

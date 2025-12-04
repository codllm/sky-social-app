import { useRef, useState, useEffect } from "react";
import { supabase } from "../supabase";
import { auth, db } from "../firebase";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";

import styles from "../styles/ProfilePage.module.css";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

export const Profile = () => {

  const [currentProfile, setProfile] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [userPost, setUserPost] = useState([]);

  // ✅ Track which post menu is open
  const [menuPostId, setMenuPostId] = useState(null);

  const chooseProfilePicture = useRef();
  const typeYourBio = useRef();
  const typeYourUserName = useRef();
  const attachedYourLink = useRef();



  const fetchUserProfile = async () => {
    const loggedUser = auth.currentUser;
    if (!loggedUser) return;

    const ref = doc(db, "users", loggedUser.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) setProfileData(snap.data());
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

 //ftech post

  useEffect(() => {
    const fetchUserPosts = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const q = query(
        collection(db, "posts"),
        where("uuid", "==", currentUser.uid)
      );

      const snap = await getDocs(q);

      setUserPost(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };

    fetchUserPosts();
  }, []);

 //edit profile

  const editYourProfile = async () => {
    const loggedUser = auth.currentUser;
    if (!loggedUser) return;

    const uid = loggedUser.uid;
    const file = chooseProfilePicture.current.files?.[0];
    const bio = typeYourBio.current.value.trim();
    const usernamee = typeYourUserName.current.value.trim();
    const weblink = attachedYourLink.current.value.trim();

    let avatarUrl = profileData?.profilepic || "";

    if (file) {
      const filePath = `public/${uid}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

      const { error } = await supabase.storage
        .from("profile_pics")
        .upload(filePath, file, { upsert: true });

      if (!error) {
        const { data } = supabase.storage
          .from("profile_pics")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }
    }

    const updatedData = {};

    if (bio) updatedData.bio = bio;
    if (weblink) updatedData.weblink = weblink;
    if (usernamee)
      updatedData.username = usernamee.endsWith(".sky")
        ? usernamee
        : usernamee + ".sky";

    if (avatarUrl) updatedData.profilepic = avatarUrl;

    await updateDoc(doc(db, "users", uid), updatedData);

    fetchUserProfile();
    setProfile(true);
  };
//logout

  const logOutcall = async () => {
    const consformation=confirm("Do you want to logged-out");
    if(!consformation) return;
    await auth.signOut();
    window.location.reload();
  };

//delet post

  const handleOnDeletePost = async (postId) => {
    try {
      const consformation=confirm("Do you want to delete post!")
      if(!consformation) return;
      await deleteDoc(doc(db, "posts", postId));

     
      setUserPost((prev) => prev.filter((post) => post.id !== postId));

      setMenuPostId(null);

      console.log("✅ Post deleted successfully");

    } catch (error) {
      console.log("❌ Error deleting post:", error.message);
    }
  };
 



  return (
    <div className={styles.profileContainer}>



      {currentProfile && (
        <div className={styles.profileHeader}>

          <div className={styles.profileLeft}>
            <div
              className={styles.profileImageBox}
              onClick={() => setProfile(false)}
            >
              <img
                src={profileData?.profilepic || "/default.jpg"}
                alt="Profile"
              />
            </div>

            <div>
              <h2 className={styles.username}>
                {profileData?.username || "No username"}
              </h2>

              <p className={styles.userBio}>
                {profileData?.bio || "No bio yet"}
              </p>

              <a
                href={profileData?.weblink || "#"}
                target="_blank"
                rel="noreferrer"
              >
                {profileData?.weblink || "Add your website"}
              </a>
            </div>
          </div>

   
<div className={styles.profileMenuContainer}>

<BsThreeDotsVertical
  className={styles.profileMenuIcon}
  onClick={() =>
    setMenuPostId(menuPostId === "profile-menu" ? null : "profile-menu")
  }
/>

<AnimatePresence>
  {menuPostId === "profile-menu" && (
    <motion.ul
      className={styles.profileDropdown}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <li onClick={() => {
        setProfile(false);
        setMenuPostId(null);
      }}>
        ✏️ Edit Profile
      </li>

      <li
        className={styles.logoutItem}
        onClick={() => {
          setMenuPostId(null);
          logOutcall();
        }}
      >
        🚪 Logout
      </li>
    </motion.ul>
  )}
</AnimatePresence>

</div>


        </div>
      )}



      {!currentProfile && (
        <div className={styles.editProfileBox}>
          <h3>Edit Profile</h3>

          <input
            type="file"
            ref={chooseProfilePicture}
            className={styles.inputField}
          />

          <input
            type="text"
            ref={typeYourUserName}
            placeholder="Username"
            className={styles.inputField}
          />

          <input
            type="text"
            ref={typeYourBio}
            placeholder="Your Bio"
            className={styles.inputField}
          />

          <input
            type="text"
            ref={attachedYourLink}
            placeholder="Website Link"
            className={styles.inputField}
          />

          <div className={styles.btnGroup}>
            <button onClick={editYourProfile} className={styles.saveBtn}>
              Save
            </button>

            <button
              onClick={() => setProfile(true)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}



      <h1 className={styles.postsTitle}>Your Posts</h1>

      <div className={styles.postsGrid}>

        {userPost.length === 0 && (
          <p className={styles.emptyPosts}>
            Create your first post ✨
          </p>
        )}

        {userPost.map((post) => (
          <div key={post.id} className={styles.postCard}>

  
            <div className={styles.threeDotIcon}>

              <BsThreeDotsVertical
                onClick={() =>
                  setMenuPostId(menuPostId === post.id ? null : post.id)
                }
              />

              <AnimatePresence>
                {menuPostId === post.id && (
                  <motion.ul
                    className={styles.postMenu}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <li onClick={() => handleOnDeletePost(post.id)}>
                      Delete
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>

            </div>

            <img src={post.post_pic} alt="Post" />

          </div>
        ))}

      </div>

    </div>
  );
};

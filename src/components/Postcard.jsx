import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { createNotification } from "./createNotification";
import UsserProfileStatus from "./UserprofileStatus";

import styles from "../styles/Home.module.css";

const Postcard = ({ post }) => {

  const { currentUser } = useAuth();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const [showHeart, setShowHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);


  const [showProfile, setShowProfile] = useState(false);
  const [clickedUid, setClickedUid] = useState(null);

  const handelTogetuserUid = (uid) => {
    setClickedUid(uid);
    setShowProfile(true);
  };


  useEffect(() => {

    const q = query(
      collection(db, "likes"),
      where("postId", "==", post.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {

      const likes = snapshot.docs.map(doc => doc.data());

      setLikeCount(likes.length);

      setLiked(likes.some(
        like => like.userId === currentUser?.uid
      ));

    });

    return () => unsub();

  }, [post.id, currentUser]);



  const toggleLike = async (withAnimation = false) => {

    if (!currentUser) return;

    const likesRef = collection(db, "likes");

    // UNLIKE
    if (liked) {

      const q = query(
        likesRef,
        where("postId", "==", post.id),
        where("userId", "==", currentUser.uid)
      );

      const snap = await getDocs(q);

      snap.forEach((d) =>
        deleteDoc(doc(db, "likes", d.id))
      );

      return;
    }

    if (withAnimation) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }

    await addDoc(likesRef, {
      postId: post.id,
      userId: currentUser.uid,
      time: serverTimestamp(),
    });

    // 🔔 NOTIFICATION
    await createNotification({
      toUid: post.uuid,
      fromUser: currentUser,
      postId: post.id,
      caption: post.caption,
      type: "like",
    });

  };


  //DOUBLE TAP 
  const handleTap = () => {

    const now = Date.now();

    if (now - lastTap < 300) {
      toggleLike(true);
    }

    setLastTap(now);
  };



  useEffect(() => {

    if (!showComments) return;

    const q = query(
      collection(db, "comment"),
      where("postId", "==", post.id)
    );

    const unsub = onSnapshot(q, (snapshot) => {

      setComments(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    });

    return () => unsub();

  }, [showComments, post.id]);



  const handleAddComment = async () => {

    if (!currentUser) return;
    if (!commentText.trim()) return;

    const userSnap = await getDoc(
      doc(db, "users", currentUser.uid)
    );

    const userData = userSnap.exists()
      ? userSnap.data()
      : {};

    await addDoc(collection(db, "comment"), {
      postId: post.id,
      userId: currentUser.uid,
      username: userData.username || "Anonymous",
      profilePic:
        userData.profilepic ||
        "/icons8-user-default-64.png",
      text: commentText,
      timestamp: serverTimestamp(),
    });

    // 🔔 COMMENT NOTIFICATION
    await createNotification({
      toUid: post.uuid,
      fromUser: currentUser,
      postId: post.id,
      caption: commentText,
      type: "comment",
    });

    setCommentText("");
  };


  return (

    <>
 
      <div className={styles.postCard}>

        <div className={styles.postHeader}>
          <img
            src={post.profilePic}
            alt=""
            className={styles.profilePic}
          />


          <span
            className={styles.username}
            onClick={() => handelTogetuserUid(post.uuid)}
          >
            {post.username}
          </span>

        </div>


        <div className={styles.caption}>{post.caption}</div>


        <div style={{ position: "relative" }}>

          <img
            src={post.post_pic}
            className={styles.post_pic}
            alt=""
            onClick={handleTap}
          />

          {/*  animation */}
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 1 }}
                exit={{ scale: 0.2, opacity: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  fontSize: "94px",
                  color: "red",
                }}
              >
                ❤️
              </motion.div>
            )}
          </AnimatePresence>

        </div>


        <div className={styles.likeSection}>
          <span onClick={() => toggleLike(false)}>
            {liked ? "❤️" : "🤍"}
            <p>{likeCount} Likes</p>
          </span>

          

          <FaRegComment
            onClick={() => setShowComments(!showComments)}
          />
        </div>

        {showComments && (

<div className={styles.commentSection}>

  {comments.map((c) => (

    <div key={c.id} className={styles.commentItem}>


      <img
        src={c.profilePic || "/icons8-user-default-64.png"}
        alt={c.username}
        className={styles.commentAvatar}
      />


      <div className={styles.commentContent}>
        <span className={styles.commentUsername}>
          {c.username}
        </span>

        <span className={styles.commentText}>
          {c.text}
        </span>
      </div>

    </div>

  ))}



  <div className={styles.commentInputContainer}>
    <input
      value={commentText}
      placeholder="Write comment..."
      onChange={(e) => setCommentText(e.target.value)}
    />

    <span onClick={handleAddComment}>
      <FaArrowUp />
    </span>
  </div>

</div>

)}


      </div>


   
      {showProfile && (
        <UsserProfileStatus
          postuuid={clickedUid}
          onClose={() => setShowProfile(false)}
        />
      )}

    </>
  );

};

export default Postcard;

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase";
import styles from "../styles/UserProfileStatus.module.css";

const UsserProfileStatus = ({ postuuid, onClose }) => {

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!postuuid) return;

    const fetchProfile = async () => {

      // ✅ USER INFO
      const userSnap = await getDoc(
        doc(db, "users", postuuid)
      );

      if (userSnap.exists()) {
        setUser(userSnap.data());
      }

      // ✅ USER POSTS
      const q = query(
        collection(db, "posts"),
        where("uuid", "==", postuuid)
      );

      const postSnap = await getDocs(q);

      setPosts(
        postSnap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      );

    };

    fetchProfile();

  }, [postuuid]);

  if (!user) return null;

  return (

    <div className={styles.profile_overlay}>

      {/* ❌ CLOSE BUTTON */}
      <button
        className={styles.close_btn}
        onClick={onClose}
      >
        ✖
      </button>


      <div className={styles.profile_page}>

        {/* ================= HEADER ================= */}
        <div className={styles.profile_header}>

          <img
            src={user.profilepic || "/defaultProfile.jpg"}
            className={styles.profile_pic}
            alt="profile"
          />

          <h2 className={styles.profile_username}>
            {user.username}
          </h2>

          {user.bio && (
            <p className={styles.profile_bio}>
              {user.bio}
            </p>
          )}

          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className={styles.profile_link}
            >
              {user.website}
            </a>
          )}

        </div>


        {/* ================= POSTS GRID ================= */}
        <div className={styles.profile_posts}>

          {posts.map((p) => (
            <img
              key={p.id}
              src={p.post_pic}
              alt="post"
              className={styles.post_img}
            />
          ))}

        </div>

      </div>

    </div>
  );
};

export default UsserProfileStatus;

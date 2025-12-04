import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { auth } from "../firebase";
import styles from "../styles/Profilepostviewer.module.css"

const ProfilePostViewer = ({ posts, onClose, onDelete }) => {
  const currentUser = auth.currentUser;

  if (!posts || posts.length === 0) return null;

  return (
    <div className={styles.viewerContainer}>
      {/* Close Button */}
      <button className={styles.closeBtn} onClick={onClose}>
        <MdOutlineCancel />
      </button>

      <div className={styles.feedScroll}>
        {posts.map((post) => (
          <div key={post.id} className={styles.viewerBox}>
            {/* Header */}
            <div className={styles.header}>
              <img
                src={post.profilePic || "/default.jpg"}
                alt="Profile"
                className={styles.profilePic}
              />
              <span className={styles.username}>{post.username}</span>

              {currentUser?.uid === post.uuid && (
                <div className={styles.menu}>
                  <BsThreeDotsVertical />
                  <ul className={styles.dropdown}>
                    <li onClick={() => onDelete(post.id)}>Delete</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Image */}
            {post.post_pic && (
              <div className={styles.imageSection}>
                <img src={post.post_pic} alt="Post" />
              </div>
            )}

            {/* Caption */}
            {post.caption && (
              <div className={styles.caption}>
                <p>{post.caption}</p>
              </div>
            )}

            {/* Like & Comment */}
            <div className={styles.actions}>
              <span>❤️ {post.likes || 0}</span>
              <span>
                <FaRegComment /> {post.comments?.length || 0}
              </span>
            </div>

            {/* Comments */}
            <div className={styles.commentsSection}>
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((c, i) => (
                  <p key={i} className={styles.commentLine}>
                    <b>{c.user}</b>: {c.text}
                  </p>
                ))
              ) : (
                <p className={styles.noComments}>No comments yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePostViewer;

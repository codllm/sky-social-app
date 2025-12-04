import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from "firebase/firestore";

import { auth, db } from "../firebase";

import { MdNotificationAdd } from "react-icons/md";

import styles from "../styles/Notification.module.css";

const Notification = () => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    if (!auth.currentUser) return;

    const q = query(
      collection(
        db,
        `notifications/${auth.currentUser.uid}/list`
      ),
      orderBy("createdAt","desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {

      setNotifications(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      );

    });

    return () => unsub();

  }, []);



  const markRead = async (id) => {

    const ref = doc(
      db,
      `notifications/${auth.currentUser.uid}/list/${id}`
    );

    await updateDoc(ref,{
      isRead:true
    });
  };


  return (

    <div className={styles.notification_container}>

      <div className={styles.notification_header}>
        Notification <MdNotificationAdd/>
      </div>

      <div className={styles.notification_list}>

        {notifications.length === 0 ? (
          <p className={styles.empty}>
            No notifications yet
          </p>
        ) : (

          notifications.map((item) => (

            <div
              key={item.id}
              onClick={() => markRead(item.id)}
              className={`${styles.notification_item}
              ${!item.isRead ? styles.unread : ""}`}
            >

              {/* USER PROFILE */}
              <img
                src={item.fromPhoto}
                alt="profile"
                className={styles.user_avatar}
              />


              {/* MESSAGE */}
              <div className={styles.text_block}>

                <span className={styles.username}>
                  {item.fromName}
                </span>{" "}
                {item.message}

                {item.caption && (
                  <p className={styles.caption}>
                    "{item.caption}"
                  </p>
                )}

              </div>


              {/* POST THUMBNAIL ✅ */}
              {item.postImage && (

                <img
                  src={item.postImage}
                  className={styles.post_thumb}
                  alt="post"
                />

              )}

            </div>

          ))

        )}

      </div>

    </div>

  );

};

export default Notification;

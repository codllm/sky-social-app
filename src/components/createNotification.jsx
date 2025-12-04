import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const createNotification = async ({
  toUid,
  fromUser,
  postId,
  type,
  caption = "",
}) => {
  try {
    if (!toUid || !fromUser) return;

    // Prevent self notifications
    if (toUid === fromUser.uid) return;

    //  Load real user profile
    const userSnap = await getDoc(doc(db, "users", fromUser.uid));
    const userData = userSnap.exists() ? userSnap.data() : {};

    //  post thumbnail
    const postSnap = await getDoc(doc(db, "posts", postId));
    const postData = postSnap.exists() ? postSnap.data() : {};

    await addDoc(
      collection(db, `notifications/${toUid}/list`),
      {
        fromUid: fromUser.uid,

        fromName:
          userData.username ||
          fromUser.displayName ||
          "User",

        fromPhoto:
          userData.profilepic ||
          "/icons8-user-default-64.png",

        postImage: postData.post_pic || "",

        postId,
        type,

        message:
          type === "like"
            ? "liked your post:"
            : "commented on your post:",

        caption,

        isRead: false,

        createdAt: serverTimestamp(),
      }
    );
  } catch (error) {
    console.log("❌ Notification error:", error);
  }
};

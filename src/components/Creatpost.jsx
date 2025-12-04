import { useRef, useState } from "react";
import { supabase } from "../supabase";
import styles from "../styles/Creatpost.module.css";
import { addDoc, collection } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";

export const Creatpost = () => {
  const [buttonState, setButtonState] = useState(false);

  const caption = useRef();
  const image = useRef();
  const tags = useRef();

  const handelOnpost = async (e) => {
    e.preventDefault();
    console.log("🟢 handelOnpost triggered");

    const Inputcaption = caption.current.value.trim();
    const imageFile = image.current.files[0];
    const Inputtags = tags.current.value.trim();

    if (!imageFile) {
      console.log("No post file attached!");
      return;
    }

    if (buttonState) return; // prevent multiple clicks
    setButtonState(true);

    try {
      const sanitizedFileName = imageFile.name
        .replace(/\s+/g, "_")
        .replace(/[:]/g, "-");

      const filePath = `public/${Date.now()}_${sanitizedFileName}`;

     
      const { data: uploadFile, error: uploadFileError } =
        await supabase.storage
          .from("post_images")
          .upload(filePath, imageFile, { upsert: false });

      if (uploadFileError) throw uploadFileError;

      const { data: publicUrlData } = supabase.storage
        .from("post_images")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      if (!imageUrl) {
        console.log("Failed to generate image URL");
        return;
      }

      console.log("Image URL successfully generated:", imageUrl);

      const loggedUser = auth.currentUser;
      if (!loggedUser) {
        console.log("⚠️ No logged-in user found!");
        return;
      }
      const userUid = loggedUser.uid;

      try {
        await addDoc(collection(db, "posts"), {
          uid: userUid,
          caption: Inputcaption,
          post_pic: imageUrl,
          tags: Inputtags,
          uuid: userUid,
          createdAt: serverTimestamp(),
        });
      } catch {
        throw SyntaxError("❌failed to creat New post");
      }

      console.log("💚Post created successfully!");
      alert("💚Post uploaded successfully!")

      caption.current.value = "";
      image.current.value = null;
      tags.current.value = "";
    } catch (error) {
      console.error("Error uploading the post:", error);
    } finally {
      setButtonState(false);
    }
  };

  return (
    <div className={styles.creatpost_main_container}>
      <center>
        <h3>Create Post</h3>
        <form onSubmit={handelOnpost}>
          <input type="text" ref={caption} placeholder="What's happening?" />
          <input type="file" ref={image} accept="image/*" />
          <input type="text" ref={tags} placeholder="tags" />
          <button type="submit" disabled={buttonState}>
            {buttonState ? "Posting..." : "Post"}
          </button>
        </form>
      </center>
    </div>
  );
};

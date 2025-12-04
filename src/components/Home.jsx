import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "../styles/Story.module.css";
import { collection, doc, onSnapshot, orderBy, query, getDoc } from "firebase/firestore";
import Postcard from "./Postcard";
import { StoryList } from "./Story";


const Home = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedPosts = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const postData = docSnap.data();
          const userUid = postData.uuid;

          const userDocRef = doc(db, "users", userUid);
          const userSnap = await getDoc(userDocRef);
          const userData = userSnap.exists() ? userSnap.data() : {};

          return {
            id: docSnap.id,
            ...postData,
            username: userData.username || "Unknown user",
            profilePic: userData.profilepic || "/defaultProfile.png",
          };
        })
      );

      setFeedPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mainWrapper">


      <div className={styles.second_main_wrapper}>

      <div style={{
  width: "100%",
  textAlign: "center",
  color: "white",
  fontSize: "30px",
  fontWeight: "900",
  background: "#000",
  fontFamily: "'Billabong', 'Pacifico', cursive",
 
}}>
  Bluesky
</div>


      <div className={styles.storyrender}>
      <StoryList></StoryList>
      </div>
      
      <div className={styles.homepageFeed}>
      
        {loading && <p>Loading posts...</p>}
        {!loading && feedPosts.length === 0 && <p>No posts available.</p>}

        {!loading &&
          feedPosts.map((post, index) => (
            <div key={post.id}>
              <Postcard post={post} />
              
            </div>
          ))}
      </div>
    
      </div>
      
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.css";
import { 
  FaHome, 
  FaSearch, 
  FaBell, 
  FaEnvelope, 
  FaPlusCircle 
} from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


const Sidebar = ({state}) => {
  const [activestate, setactivestate ]=useState("Home");
  const navItems = [
    { name: "Home", icon: <FaHome /> },
    { name: "Search", icon: <FaSearch /> },
    { name: "Notification", icon: <FaBell /> },
    { name: "Messages", icon: <FaEnvelope /> },
    { name: "Create Post", icon: <FaPlusCircle /> },
  ];

  const handelonclick=(name)=>{

    //here set the current state
    setactivestate(name);
    state(name)

  }
  const [profilepic, setprofilepic] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log("You are not logged-in");
      return;
    }

    const fetchProfilepic = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userDocRef = await getDoc(userRef);

        if (!userDocRef.exists()) {
          console.log("Failed to get the user profilepic");
          return;
        }

        setprofilepic(userDocRef.data().profilepic);
      } catch (error) {
        console.log("Image not found:", error);
      }
    };

    fetchProfilepic();
  }, []);

  return (
    <div className={styles.sidebar}>
      <ul className={styles.sidebar_content}>
        {navItems.map((item) => (
          <li key={item.name} className={styles.nav_item}>
            <button
              className={`${styles.nav_link} ${
                activestate === item.name ? styles.active : ""
              }`}
              onClick={()=> handelonclick(item.name)}
            >
              <span className={styles.sidebar_icon}>{item.icon}</span>
              <span className={styles.nav_text}>{item.name}</span>
            </button>
          </li>
        ))}
         <div className={styles.profilefor_small_scrren}>
        <button
          className={`${styles.profile_link} ${
            activestate === "Profile" ? styles.active : ""
          }`}
          onClick={() => handelonclick("Profile")}
        >
          <img
            src={profilepic || "/defaultProfile.jpg"}
            alt="Profile"
            className={styles.profile_img}
          />
          <strong className={styles.profile_name}>Profile</strong>
        </button>
      </div> 
      </ul>

      <hr className={styles.divider} />

      <div className={styles.profile_section}>
        <button
          className={`${styles.profile_link} ${
            activestate === "Profile" ? styles.active : ""
          }`}
          onClick={() => handelonclick("Profile")}
        >
          <img
            src={profilepic || "/defaultProfile.jpg"}
            alt="Profile"
            className={styles.profile_img}
          />
          <strong className={styles.profile_name}>Profile</strong>
        </button>
      </div> 
    </div>
  );
};

export default Sidebar;

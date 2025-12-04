import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import LoginPage from "../components/LoginPage";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { Creatpost } from "../components/Creatpost";
import { Profile } from "../components/Profile";
import Notification from "../components/Notification";

import styles from "./sky.module.css";

export const Skyapp = () => {

  const { currentUser, loading } = useAuth();

  const [currentactive, setActive] = useState("Home");

  if (loading) return <div className={styles.loader}></div>;
  if (!currentUser) return <LoginPage />;

  return (
    <div className={styles.app_open_state}>

      <div className={styles.sidebar_state}>
        <Sidebar state={setActive} />
      </div>

      {/* ✅ MAIN CONTENT — KEEP COMPONENTS MOUNTED */}
      <div className={styles.content_wrapper}>

        {/* HOME */}
        <div style={{ display: currentactive === "Home" ? "block" : "none" }}>
          <div className={styles.home_state}>
            <Home />
          </div>
        </div>

        {/* CREATE POST */}
        <div
          style={{
            display: currentactive === "Create Post" ? "block" : "none",
          }}
        >
          <div className={styles.creatpost_state}>
            <Creatpost state={setActive} />
          </div>
        </div>

        {/* PROFILE */}
        <div
          style={{
            display: currentactive === "Profile" ? "block" : "none",
          }}
        >
          <div className={styles.profile_state}>
            <Profile />
          </div>
        </div>

        {/* NOTIFICATION */}
        <div
          style={{
            display: currentactive === "Notification" ? "block" : "none",
          }}
        >
          <div className={styles.profile_state}>
            <Notification />
          </div>
        </div>

      </div>
    </div>
  );
};

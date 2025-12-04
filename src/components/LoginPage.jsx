import { useState } from "react";
import styles from "../styles/LoginPage.module.css";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GiButterfly } from "react-icons/gi";

const LoginPage = () => {
  const [view, setView] = useState("intro"); 

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) console.log("✅ Login:", userSnap.data());
    } catch (error) {
      console.error("❌ Login failed:", error.message);
      alert("Oops! The details don’t match our records. Please try again.")
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const usernameInput = e.target.username.value.trim();

    if(!email){
      alert("invaild email");
      return;
    }
    if(!usernameInput){
      alert("Enter your name");
      return;
    }
    if(!password){
      alert("creat password");
      return;
    }

    if (!email || !password || !usernameInput) return;

    const username = usernameInput.endsWith(".sky")
      ? usernameInput
      : `${usernameInput}.sky`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        username,
        bio:"",
        profilepic: "/296fe121-5dfa-43f4-98b5-db50019738a7.jpg",
        createdAt: new Date(),
        uuid: newUser.uid,
        email
      });

      console.log("✅ Signup complete");
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
      alert("Invalid credentials...")
    }
  };

  return (
    <div className={styles.mainloginpage}>

      {view === "intro" && (
        <div className={styles.introContainer}>
          <div className={styles.logo}>
            Bluesky <GiButterfly />
          </div>

          <p className={styles.welcomeText}>
            Welcome to the <br />
            <span>social internet.</span>
          </p>

          <div className={styles.introText}>
            Bluesky is{" "}
            <span className={styles.highlight}>social media as it should be.</span>
            Find your community, share creativity and{" "}
            <span className={styles.highlight}>have fun again.</span>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.switchBtn} onClick={() => setView("login")}>
              Log In
            </button>
            <button className={styles.switchBtn} onClick={() => setView("signup")}>
              Sign Up
            </button>
          </div>
        </div>
      )}

      {view === "login" && (
        <div className={styles.formContainer}>
          <h2>Login</h2>

          <form onSubmit={handleLogin} autoComplete="off">
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="new-password"
                required
              />
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
            </div>

            <button className={styles.submitBtn} type="submit">
              Login
            </button>
          </form>

          <p className={styles.switchText}>
            Don’t have an account?{" "}
            <span onClick={() => setView("signup")} className={styles.linkText}>
              Sign up
            </span>
          </p>
        </div>
      )}

      {view === "signup" && (
        <div className={styles.formContainer}>
          <h2>Sign Up</h2>

          <form onSubmit={handleSignup} autoComplete="off">
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="new-password"
                required
              />
            </div>

            <div className={styles.inputWrapper} style={{backgroundColor:"white"}}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                inputMode="text"
                autoComplete="off"
                required
              />
              <span className={styles.suffix}>.sky</span>
            </div>

            <div className={styles.inputWrapper}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                required
              />
            </div>

            <button className={styles.submitBtn} type="submit">
              Sign Up
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <span onClick={() => setView("login")} className={styles.linkText}>
              Login
            </span>
          </p>
        </div>
      )}

    </div>
  );
};

export default LoginPage;

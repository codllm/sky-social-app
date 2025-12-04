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

    if (!email || !password) {
      console.error("⚠️ Email and password are required!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (userSnap.exists()) {
        console.log("✅ Login successful:", userSnap.data());
      } else {
        console.warn("⚠️ User document not found in Firestore");
      }
    } catch (error) {
      console.error("❌ Login failed:", error.message);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const usernameInput = e.target.username.value.trim();

    if (!email || !password || !usernameInput) {
      console.error("⚠️ Please fill all fields");
      return;
    }

    const username = usernameInput.endsWith(".sky")
      ? usernameInput
      : `${usernameInput}.sky`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await setDoc(doc(db, "users", newUser.uid), {
        username,
        bio: "",
        profilepic: "296fe121-5dfa-43f4-98b5-db50019738a7.jpg",
        createdAt: new Date(),
        uuid: newUser.uid,
        email,
      });

      console.log("✅ Signup complete, Firestore document created");
      console.log("🎉 Welcome to social.sky");
    } catch (error) {
      console.error("❌ Signup failed:", error.message);
    }
  };



  const IntroView = () => (
    <div className={styles.introContainer}>
       <div style={{
  width: "100%",
  textAlign: "center",
  color: "white",
  fontSize: "40px",
  fontWeight: "900",
  
  fontFamily: "'Billabong', 'Pacifico', cursive",
  cursor:"pointer"
 
}}>
  Bluesky <GiButterfly />
</div>
      <h1 className={styles.skyTitle}>sky</h1>
      <p className={styles.welcomeText}>
        Welcome to the <br />
        <span>social internet.</span>
      </p>

      <div className={styles.introText}>
        Bluesky is{" "}
        <span className={styles.highlight}>social media as it should be.</span>
        Find your community among millions of users, unleash your creativity, and{" "}
        <span className={styles.highlight}>have some fun again.</span>
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
  );

  const LoginView = () => (
    <div className={styles.formContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className={styles.inputWrapper}>
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div className={styles.inputWrapper}>
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <button type="submit" className={styles.submitBtn}>Login</button>
      </form>
      <p className={styles.switchText}>
        Don’t have an account?{" "}
        <span onClick={() => setView("signup")} className={styles.linkText}>
          Sign up
        </span>
      </p>
    </div>
  );

  const SignupView = () => (
    <div className={styles.formContainer}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div className={styles.inputWrapper}>
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <div className={styles.inputWrapper}>
          <input type="text" name="username" placeholder="Username" required />
          <span className={styles.suffix}>.sky</span>
        </div>
        <div className={styles.inputWrapper}>
          <input type="password" name="password" placeholder="Password" required />
        </div>
        <button type="submit" className={styles.submitBtn}>Sign Up</button>
      </form>
      <p className={styles.switchText}>
        Already have an account?{" "}
        <span onClick={() => setView("login")} className={styles.linkText}>
          Login
        </span>
      </p>
    </div>
  );


  return (
    <div className={styles.mainloginpage}>
      {view === "intro" && <IntroView />}
      {view === "login" && <LoginView />}
      {view === "signup" && <SignupView />}
    </div>
  );
};

export default LoginPage;

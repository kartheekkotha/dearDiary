import { useState } from "react";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import Layout from "../components/layout";
import Head from "next/head";
import { auth } from "../firebase/firebase";
import { AuthProvider, useAuth } from "../context/AuthContext";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

const SignupLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const auth = getAuth();
  const db = getFirestore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, { displayName });
      const userId = userCredential.user.uid;
      await setDoc(doc(db, "users", userId), {
        email: email,
        username: displayName,
      });
      const subcollections = ["diaries", "blogs", "sharedId"];
      await Promise.all(
        subcollections.map(async (subcollection) => {
          const subcollectionRef = collection(
            db,
            "users",
            userId,
            subcollection
          );
          // await setDoc(doc(subcollectionRef, 'placeholder'), { example: 'example' });
        })
      );

      router.push("/");
    } catch (error) {
      alert("Invalid Credentials");
      console.error("Error signing up:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      alert("Invalid Credentials");
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const userId = userCredential.user.uid;
      // Check if the user already exists in the database
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          username: userCredential.user.displayName,
        });
        // Create subcollections for the user (e.g., diaries, blogs, couples)
        const subcollections = ["diaries", "blogs", "couples"];
        await Promise.all(
          subcollections.map(async (subcollection) => {
            const subcollectionRef = collection(
              db,
              "users",
              userId,
              subcollection
            );
            // await setDoc(doc(subcollectionRef, 'placeholder'), { example: 'example' });
          })
        );
      }

      router.push("/");
    } catch (error) {
      alert("Failed to login");
      console.error("Error logging in with Google:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Head>
        <title>Dear Diary</title>
        <meta name="description" content="A version of yourself" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/dearDiary.ico" />
      </Head>
      <Layout>
        <div className="container mt-5">
          <ul className="nav nav-pills nav-justified mb-3" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                onClick={() => handleTabChange("login")}
              >
                Login
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${
                  activeTab === "register" ? "active" : ""
                }`}
                onClick={() => handleTabChange("register")}
              >
                Register
              </button>
            </li>
          </ul>
          <div className="tab-content">
            <div
              className={`tab-pane fade ${
                activeTab === "login" ? "show active" : ""
              }`}
            >
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              <button
                type="button"
                className="btn btn-danger btn-block mt-3"
                onClick={handleGoogleLogin}
              >
                Sign in with Google
              </button>
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "register" ? "show active" : ""
              }`}
            >
              <form onSubmit={handleSignup}>
                <div className="mb-3">
                  <label htmlFor="displayName" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Sign up
                </button>
              </form>
              <button
                type="button"
                className="btn btn-danger btn-block mt-3"
                onClick={handleGoogleLogin}
              >
                Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SignupLogin;

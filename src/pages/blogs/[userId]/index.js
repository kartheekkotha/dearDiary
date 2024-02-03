// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import Head from "next/head";

// Define the BlogIndexPage component
const BlogIndexPage = () => {
  // Initialize router and state variables
  const router = useRouter();
  const { userId } = router.query;
  const [blogs, setBlogs] = useState([]);
  const [userName, setUserName] = useState("");

  // Fetch user name when component mounts
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserName(userData.username);
          console.log(userData.username);
        } else {
          console.error("User document not found");
        }
      } catch (error) {
        console.error("Error fetching user document:", error);
      }
    };

    if (userId) {
      fetchUserName();
    }
  }, [userId]);

  // Fetch blogs when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const db = getFirestore();
        const blogsRef = collection(db, "users", userId, "blogs");
        const q = query(blogsRef, orderBy("createdAt", "desc"));

        const querySnapshot = await getDocs(q);
        const blogsData = [];
        querySnapshot.forEach((doc) => {
          blogsData.push({ id: doc.id, ...doc.data() });
        });
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    if (userId) {
      fetchBlogs();
    }
  }, [userId]);

  // Render the component
  return (
    <>
    <Head>
      <title>Dear Diary</title>
      <meta name="description" content="A version of yourself" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/dearDiary.ico" />
    </Head>
    <Layout>
      <div>
        <h1>Welcome back, {userName}</h1>
        <div>
          <button className="create-btn" onClick={() => router.push(`/blogs/${userId}/create`)}>
            Create Blog
          </button>
        </div>
        {/* Display blog entries */}
        {blogs.length === 0 ? (
          <p>No blog entries found.</p>
        ) : (
          <ul>
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Link href={`/blogs/${userId}/${blog.id}`}>
                  {/* Display title as link */}
                  <div style={{ cursor: "pointer" }}>{blog.title}</div>
                </Link>
                {/* Display created time */}
                <p>
                  Created at:{" "}
                  {new Date(blog.createdAt.seconds * 1000).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
    </>
  );
};

// Export the component as default
export default BlogIndexPage;

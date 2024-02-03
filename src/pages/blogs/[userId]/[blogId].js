// Import necessary dependencies
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import Head from "next/head";

// Define the BlogPage component
const BlogPage = () => {
  // Initialize router and state variables
  const router = useRouter();
  const { userId, blogId } = router.query;
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false); // State variable to track editing mode
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserName(userData.username);
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

  // Fetch blog when component mounts or userId and blogId change
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const db = getFirestore();
        const blogRef = doc(db, "users", userId, "blogs", blogId);

        const docSnapshot = await getDoc(blogRef);
        if (docSnapshot.exists()) {
          const blogData = docSnapshot.data();
          setBlog({ id: docSnapshot.id, ...blogData });
          setTitle(blogData.title);
          setContent(blogData.content);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    if (userId && blogId) {
      fetchBlog();
    }
  }, [userId, blogId]);

  // Handle editing the blog
  const handleEdit = async () => {
    try {
      const db = getFirestore();
      const blogRef = doc(db, "blogs", userId, blogId);

      await updateDoc(blogRef, { title, content });
      setBlog((prevBlog) => ({ ...prevBlog, title, content }));
      setIsEditing(false); // Toggle editing mode off after saving changes
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

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
        <h1>Blog by {userName}</h1>
        {blog && (
          <>
            {!isEditing && (
              <>
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <h2>Title: {blog.title}</h2>
                <p>Content: {blog.content}</p>
              </>
            )}
            {isEditing && (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button onClick={handleEdit}>Save Changes</button>
              </>
            )}
            {/* Go back button */}
            <button onClick={() => router.push(`/blogs/${userId}`)}>
              Go Back
            </button>
          </>
        )}
      </div>
    </Layout>
    </>
  );
};

// Export the component as default
export default BlogPage;

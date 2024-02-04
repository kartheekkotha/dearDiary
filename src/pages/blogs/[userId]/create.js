import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import Head from "next/head";

// Define the CreateBlogPage component
const CreateBlogPage = () => {
  // Initialize router and state variables
  const router = useRouter();
  const { userId } = router.query;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useAuth();

  // Handle creating a new blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const blogsRef = collection(db, "users", userId, "blogs");
      await addDoc(blogsRef, {
        content,
        createdAt: new Date(),
        createdBy: user.uid, // Assuming you have access to the current user
        // Add the username of the user who wrote the blog
        userName: user.displayName, // Assuming you have access to the user's display name
      });
      router.push(`/blogs/${userId}`);
    } catch (error) {
      console.error("Error creating blog:", error);
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
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="container">
          <h1 className="text-center">Create Quote</h1>
          <form onSubmit={handleCreateBlog}>
            <div className="form-group">
              <label>Content:</label>
              <textarea
                className="form-control"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <p> </p>
            <div className="text-center">
              <button type="submit" className="btn btn-primary create-btn">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</Layout>

    </>
  );
};

// Export the component as default
export default CreateBlogPage;

import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";

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
        title,
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
    <Layout>
      <div>
        <h1>Create Blog Entry</h1>
        <form onSubmit={handleCreateBlog}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </Layout>
  );
};

// Export the component as default
export default CreateBlogPage;

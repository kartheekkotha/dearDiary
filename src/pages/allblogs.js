import Layout from "../components/layout";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useState, useEffect } from "react";
import { getFirestore, collectionGroup, getDocs } from "firebase/firestore";

const BlogPage = () => {
  // Initialize state to hold the list of blogs
  const [blogs, setBlogs] = useState([]);

  // Fetch all blogs from all users when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const db = getFirestore();
        const blogsRef = collectionGroup(db, "blogs");
        const querySnapshot = await getDocs(blogsRef);
        const blogsData = [];
        querySnapshot.forEach((doc) => {
          // Extract userId from the blog document's path
          const userId = doc.ref.parent.parent.id;
          blogsData.push({ id: doc.id, userId, ...doc.data() });
        });
        setBlogs(blogsData);
        console.log(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <Head>
        <title>Dear Diary</title>
        <meta name="description" content="A version of yourself" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/dearDiary.ico" />
      </Head>
      <Layout>
        <section className="vh-100" >
          <div className="container py-5 h-100">
            <h1 className="text-center mb-2">All Blogs</h1>
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-lg-10 col-xl-8">
                {blogs.map((blog) => (
                  <div key={blog.id} className="card backgroundColor: '#cbd5e0' text-muted rounded-3 mb-3"  style={{ backgroundColor: '#cbd5e0' }}>
                    <div className="card-body p-4">
                      <h4>{blog.content}</h4>
                      <p> </p>
                      <p className="blockquote-footer mb-0 text-muted">{blog.userName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default BlogPage;

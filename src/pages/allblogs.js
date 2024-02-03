import Layout from '../components/layout';
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useState, useEffect } from 'react';
import { getFirestore, collectionGroup, getDocs } from 'firebase/firestore';

const BlogPage = () => {
    // Initialize state to hold the list of blogs
    const [blogs, setBlogs] = useState([]);

    // Fetch all blogs from all users when component mounts
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const db = getFirestore();
                const blogsRef = collectionGroup(db, 'blogs');
                const querySnapshot = await getDocs(blogsRef);
                const blogsData = [];
                querySnapshot.forEach((doc) => {
                    // Extract userId from the blog document's path
                    const userId = doc.ref.parent.parent.id;
                    blogsData.push({ id: doc.id, userId, ...doc.data() });
                });
                setBlogs(blogsData);
            } catch (error) {
                console.error('Error fetching blogs:', error);
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
                <div className={styles.container}>
                    <main className={styles.main}>
                        <h1 className={styles.title}>Blog Page</h1>
                        <ul className={styles.list}>
                            {/* Render each blog */}
                            {blogs.map((blog) => (
                                <li key={blog.id} className={styles.item}>
                                    <h2>{blog.title}</h2>
                                    <p>{blog.content}</p>
                                    <p>Written by: {blog.userName}</p> {/* Display username */}
                                </li>
                            ))}
                        </ul>
                    </main>
                </div>
            </Layout>
        </>
    );
};

export default BlogPage;

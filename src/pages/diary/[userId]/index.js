// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

// Define the DiaryIndexPage component
const DiaryIndexPage = () => {
    // Initialize router and state variables
    const router = useRouter();
    const { userId } = router.query;
    const [diaries, setDiaries] = useState([]);
    const [userName, setUserName] = useState('');

    // Fetch user name when component mounts
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', userId);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setUserName(userData.username);
                } else {
                    console.error('User document not found');
                }
            } catch (error) {
                console.error('Error fetching user document:', error);
            }
        };

        if (userId) {
            fetchUserName();
        }
    }, [userId]);

    // Fetch diaries when component mounts or userId changes
    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const db = getFirestore();
                const diariesRef = collection(db, 'users', userId, 'diaries');
                const q = query(diariesRef, orderBy('createdAt', 'desc'));

                const querySnapshot = await getDocs(q);
                const diariesData = [];
                querySnapshot.forEach((doc) => {
                    diariesData.push({ id: doc.id, ...doc.data() });
                });
                setDiaries(diariesData);
            } catch (error) {
                console.error('Error fetching diaries:', error);
            }
        };

        if (userId) {
            fetchDiaries();
        }
    }, [userId]);

    // Render the component
    return (
        <Layout>
            <div>
                {/* Display user name */}
                <h1>Hello, Welcome Back {userName}</h1>
                <div>
                    <button onClick={() => router.push(`/diary/${userId}/create`)}>Create Diary</button>
                </div>
                {/* Display diary entries */}
                {diaries.length === 0 ? (
                    <p>No diary entries found.</p>
                ) : (
                    <ul>
                        {diaries.map((diary) => (
                            <li key={diary.id}>
                                <Link href={`/diary/${userId}/${diary.id}`}>
                                    {/* Display title as link */}
                                    <div style={{ cursor: 'pointer' }}>{diary.title}</div>
                                </Link>
                                {/* Display created time */}
                                <p>Created at: {new Date(diary.createdAt.seconds * 1000).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

// Export the component as default
export default DiaryIndexPage;

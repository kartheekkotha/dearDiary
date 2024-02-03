import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const DiaryPage = () => {
    const router = useRouter();
    const { userId, diaryId } = router.query;
    const [diary, setDiary] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State variable to track editing mode
    const [userName, setUserName] = useState('');

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

    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const db = getFirestore();
                const diaryRef = doc(db, 'users', userId, 'diaries', diaryId);

                const docSnapshot = await getDoc(diaryRef);
                if (docSnapshot.exists()) {
                    const diaryData = docSnapshot.data();
                    setDiary({ id: docSnapshot.id, ...diaryData });
                    setTitle(diaryData.title);
                    setContent(diaryData.content);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching diary:', error);
            }
        };

        if (userId && diaryId) {
            fetchDiary();
        }
    }, [userId, diaryId]);

    const handleEdit = async () => {
        try {
            const db = getFirestore();
            const diaryRef = doc(db, 'users', userId, 'diaries', diaryId);

            await updateDoc(diaryRef, { title, content });
            setDiary((prevDiary) => ({ ...prevDiary, title, content }));
            setIsEditing(false); // Toggle editing mode off after saving changes
        } catch (error) {
            console.error('Error updating diary:', error);
        }
    };

    return (
        <Layout>
            <div>
                <h1>Diary by {userName}</h1>
                {diary && (
                    <>
                        {!isEditing && (
                            <>
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                <h2>Title: {diary.title}</h2>
                                <p>Content: {diary.content}</p>
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
                        <button onClick={() => router.push(`/diary/${userId}`)}>Go Back</button>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default DiaryPage;

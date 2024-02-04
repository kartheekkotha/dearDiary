import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import { getFirestore, collection, query, where, getDocs, getDoc, addDoc,doc } from 'firebase/firestore';
import Head from "next/head";

const BlogIndexPage = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [sharedIds, setSharedIds] = useState([]);
    const [hasSelfLink, setHasSelfLink] = useState(false);
    const [sharedWithEmail, setSharedWithEmail] = useState('');
    const [usernames, setUsernames] = useState({});

    useEffect(() => {
        const fetchSharedIds = async () => {
            try {
                const db = getFirestore();
                const sharedIdsRef = collection(db, 'users', userId, 'couples');
                const q = query(sharedIdsRef);

                const querySnapshot = await getDocs(q);
                const sharedIdsData = [];
                querySnapshot.forEach(async (doc) => {
                    const data = { id: doc.id, ...doc.data() };
                    sharedIdsData.push(data);
                    if (data.isSelf) {
                        setHasSelfLink(true);
                    }
                    // Fetch username for user2Id
                    const username = await fetchUserName(data.user2Id);
                    console.log(username);
                    setUsernames((prevUsernames) => ({
                        ...prevUsernames,
                        [data.id]: username,
                    }));
                });
                setSharedIds(sharedIdsData.filter((sharedId) => !sharedId.isSelf));
            } catch (error) {
                console.error('Error fetching shared IDs:', error);
            }
        };

        if (userId) {
            fetchSharedIds();
        }
    }, [userId]);


    const fetchUserName = async (userId) => {
        try {
            const db = getFirestore();
            const userDoc = doc(db, 'users', userId);
            const userdocument = await getDoc(userDoc);
            if (userdocument.exists()) {
                const userData = userdocument.data();
                console.log(userData.displayName)
                return userData.username;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    };
    const handleCreateSelfLink = async () => {
        try {
            const db = getFirestore();
            const couplesRef = collection(db, 'users', userId, 'couples');
            const sharedLinkId = generateSharedLinkId(); // Generate a unique shared link ID
            await addDoc(couplesRef, { id: sharedLinkId, user1Id: userId, user2Id: userId, isSelf: true, createdAt: new Date() });
            setHasSelfLink(true);
        } catch (error) {
            console.error('Error creating self link:', error);
        }
    };

    const handleCreateSharedLink = async () => {
        const modal = document.getElementById('addSharedLinkModal');
        modal.style.display = 'block';
    };

    const handleAddSharedLink = async () => {
        try {
            const db = getFirestore();
            // Get the user ID of the user with the provided email
            const userSnapshot = await getDocs(collection(db, 'users'));
            const userDoc = userSnapshot.docs.find((doc) => doc.data().email === sharedWithEmail);
            const user2Id = userDoc.id;
            const sharedLinkId = generateSharedLinkId(); // Generate a unique shared link ID

            // Create shared link documents for both users with the same shared link ID
            // const couplesRefUser1 = collection(db, 'users', userId, 'couples');
            // await addDoc(couplesRefUser1, { id: sharedLinkId, user1Id: userId, user2Id, isSelf: false, createdAt: new Date() });

            const couplesRefUser2 = collection(db, 'users', user2Id, 'couples');
            await addDoc(couplesRefUser2, { id: sharedLinkId, user1Id: user2Id, user2Id: userId, isSelf: false, createdAt: new Date() });

            // Close the modal
            const modal = document.getElementById('addSharedLinkModal');
            modal.style.display = 'none';
        } catch (error) {
            console.error('Error adding shared link:', error);
        }
    };

    const handleCloseModal = () => {
        const modal = document.getElementById('addSharedLinkModal');
        modal.style.display = 'none';
    };

    // Function to generate a unique shared link ID
    const generateSharedLinkId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    const handleNavigateToChat = (user1Id , user2Id) => () => {
        router.push(`/chat/${user1Id}/${user2Id}`);
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
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h1>Blog Index Page</h1>
                {!hasSelfLink && (
                    <button className="create-btn" onClick={handleCreateSelfLink}>Create Self Link</button>
                )}
                {hasSelfLink && (
                    <button className="create-btn" onClick={handleNavigateToChat(userId , userId)}>Open To chat with past you</button>
                )}
                <p> </p>
                <h2>Shared IDs:</h2>
                <button className="create-btn" onClick={handleCreateSharedLink}>Create Shared Link</button>
                <div className="container mt-3">
                <ul className='list-group'>
                    {sharedIds.map((sharedId) => (
                    <li className='list-group-item d-flex justify-content-between align-items-center' key={sharedId.id}>
                        <span>{usernames[sharedId.id] || sharedId.user2Id}</span>
                        <button className="btn btn-secondary" onClick={() => handleNavigateToChat(userId, sharedId.user2Id)}>Chat</button>
                    </li>
                    ))}
                </ul>
                </div>
                <div id="addSharedLinkModal" className="modal">
                    <div className="modal-content ">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Add Shared Link</h2>
                        <input className="create-btn" type="email" value={sharedWithEmail} onChange={(e) => setSharedWithEmail(e.target.value)} />
                        <button className="create-btn" onClick={handleAddSharedLink}>Add</button>
                    </div>
                </div>
            </div>
        </Layout>
        </>
    );
};

export default BlogIndexPage;

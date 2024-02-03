import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import { getFirestore, collection, query, where, getDocs, getDoc, addDoc } from 'firebase/firestore';

const BlogIndexPage = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [sharedIds, setSharedIds] = useState([]);
    const [hasSelfLink, setHasSelfLink] = useState(false);
    const [sharedWithEmail, setSharedWithEmail] = useState('');

    useEffect(() => {
        const fetchSharedIds = async () => {
            try {
                const db = getFirestore();
                const sharedIdsRef = collection(db, 'users', userId, 'couples');
                const q = query(sharedIdsRef);

                const querySnapshot = await getDocs(q);
                const sharedIdsData = [];
                querySnapshot.forEach((doc) => {
                    const data = { id: doc.id, ...doc.data() };
                    sharedIdsData.push(data);
                    if (data.isSelf) {
                        setHasSelfLink(true);
                    }
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
            const userDoc = await getDoc(collection(db, 'users').doc(userId));
            if (userDoc.exists()) {
                return userDoc.data().displayName;
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
            const couplesRefUser1 = collection(db, 'users', userId, 'couples');
            await addDoc(couplesRefUser1, { id: sharedLinkId, user1Id: userId, user2Id, isSelf: false, createdAt: new Date() });

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

    const handleNavigateToChat = (user2Id) => () => {
        router.push(`/chat/${user2Id}`);
    };

    return (
        <Layout>
            <div>
                <h1>Blog Index Page</h1>
                {!hasSelfLink && (
                    <button onClick={handleCreateSelfLink}>Create Self Link</button>
                )}
                {hasSelfLink && (
                    <button onClick={handleNavigateToChat(userId)}>Open To chat with past you</button>
                )}
                <h2>Shared IDs:</h2>
                <button onClick={handleCreateSharedLink}>Create Shared Link</button>
                <ul>
                    {sharedIds.map((sharedId) => (
                        <li key={sharedId.id}>
                            {sharedId.id}
                            <button onClick={handleNavigateToChat(sharedId.user2Id)}>Chat</button>
                        </li>
                    ))}
                </ul>
                <div id="addSharedLinkModal" className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Add Shared Link</h2>
                        <input type="email" value={sharedWithEmail} onChange={(e) => setSharedWithEmail(e.target.value)} />
                        <button onClick={handleAddSharedLink}>Add</button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default BlogIndexPage;

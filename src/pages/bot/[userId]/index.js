import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

const BlogIndexPage = () => {
    const router = useRouter();
    const { userId } = router.query;
    const [sharedIds, setSharedIds] = useState([]);
    const [hasSelfLink, setHasSelfLink] = useState(false);

    useEffect(() => {
        const fetchSharedIds = async () => {
            try {
                const db = getFirestore();
                const sharedIdsRef = collection(db, 'users', userId, 'couples');
                const q = query(sharedIdsRef, where('isSelf', '==', false)); // Exclude self links

                const querySnapshot = await getDocs(q);
                const sharedIdsData = [];
                querySnapshot.forEach((doc) => {
                    sharedIdsData.push({ id: doc.id, ...doc.data() });
                    if (doc.data().isSelf) {
                        setHasSelfLink(true);
                        console.log("Yes")
                    }
                });
                setSharedIds(sharedIdsData);
            } catch (error) {
                console.error('Error fetching shared IDs:', error);
            }
        };

        if (userId) {
            fetchSharedIds();
        }
    }, [userId]);

    const handleCreateSelfLink = async () => {
        try {
            const db = getFirestore();
            const couplesRef = collection(db, 'users', userId, 'couples');
            await addDoc(couplesRef, { user1Id: userId, user2Id: userId, isSelf: true, createdAt: new Date() });
            setHasSelfLink(true);
        } catch (error) {
            console.error('Error creating self link:', error);
        }
    };

    const handleOpenToChat = () => {
        const sharedIdWithUser2Id = sharedIds.find((sharedId) => sharedId.user2Id);
        if (sharedIdWithUser2Id) {
            router.push(`/chat/${sharedIdWithUser2Id.user2Id}`);
        }
    };

    return (
        <Layout>
            <div>
                <h1>Blog Index Page</h1>
                {!hasSelfLink && (
                    <button onClick={handleCreateSelfLink}>Create Self Link</button>
                )}
                <button onClick={handleOpenToChat}>Open To chat with past you</button>
                <h2>Shared IDs:</h2>
                <ul>
                    {sharedIds.map((sharedId) => (
                        <li key={sharedId.id}>{sharedId.id}</li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default BlogIndexPage;

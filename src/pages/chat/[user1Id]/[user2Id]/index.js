// chat/[user2Id].js

import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';

const ChatPage = () => {
    const router = useRouter();
    const { user1Id, user2Id } = router.query; // Receive both user1Id and user2Id from the URL

    const handleGoBack = () => {
        router.push(`/bot/${user1Id}`);
    };

    return (
        <Layout>
            <div>
                <h1>Chat with User {user2Id}</h1>
                <p>This is the chat page for user {user2Id}.</p>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        </Layout>
    );
};


export default ChatPage;

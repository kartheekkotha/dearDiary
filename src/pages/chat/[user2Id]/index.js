// chat/[user2Id].js

import { useRouter } from 'next/router';
import Layout from '../../../components/layout';

const ChatPage = () => {
    const router = useRouter();
    const { user2Id } = router.query;

    return (
        <Layout>
            <div>
                <h1>Chat with User {user2Id}</h1>
                <p>This is the chat page for user {user2Id}.</p>
            </div>
        </Layout>
    );
};

export default ChatPage;

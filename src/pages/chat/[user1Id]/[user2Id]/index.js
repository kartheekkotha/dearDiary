// chat/[user2Id].js

import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import Head from "next/head";

const ChatPage = () => {
    const router = useRouter();
    const { user1Id, user2Id } = router.query; // Receive both user1Id and user2Id from the URL

    const handleGoBack = () => {
        router.push(`/bot/${user1Id}`);
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
            <div>
                <h1>Chat with User {user2Id}</h1>
                <p>This is the chat page for user {user2Id}.</p>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        </Layout>
        </>
    );
};


export default ChatPage;

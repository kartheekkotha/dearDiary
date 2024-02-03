import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import Head from "next/head";
import React, { useState, useEffect } from 'react';
import OpenAI from "openai";
import firebase from 'firebase/app';
import { getFirestore, doc, getDoc,getDocs, updateDoc, collection } from 'firebase/firestore';
import 'firebase/firestore';

const ChatPage = () => {
    const router = useRouter();
    const { user1Id, user2Id } = router.query;

    const handleGoBack = () => {
        router.push(`/bot/${user1Id}`);
    };

    const client = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true });
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetchDiaryEntries(user2Id);
        fetchBlogs(user2Id);
    }, [user2Id]);

    const fetchDiaryEntries = async (userId) => {
        try {
            const db = getFirestore();
            const diaryRef = collection(db, `users/${userId}/diaries`); // Reference to the diaries collection
            const snapshot = await getDocs(diaryRef); // Fetch documents from the collection
            const diaryData = snapshot.docs.map(doc => doc.data()); // Extract data from each document
            setDiaryEntries(diaryData); // Update state with diary entries
            console.log(diaryData);
        } catch (error) {
            console.error('Error fetching diary entries:', error);
        }
    };
    
    const fetchBlogs = async (userId) => {
        try {
            const db = getFirestore();
            const blogsRef = collection(db, `users/${userId}/blogs`); // Reference to the blogs collection
            const snapshot = await getDocs(blogsRef); // Fetch documents from the collection
            const blogsData = snapshot.docs.map(doc => doc.data()); // Extract data from each document
            setBlogs(blogsData); // Update state with blogs data
            console.log(blogsData);
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = () => {
        const userMessage = `You: ${message}`;
        const updatedConversation = [...conversation, userMessage]; // Update conversation with user's message
    
        const finalQuery = updatedConversation.join('\n'); // Add user's message to the query
    
        client.chat.completions.create({
            messages: [
                { "role": "system", "content": "You are a helpful assistant." },
                { "role": "user", "content": finalQuery },
            ],
            model: "gpt-3.5-turbo",
        })
        .then((completion) => {
            const botReply = `${completion.choices[0].message.content}`;
            const updatedConversationWithBotReply = [...updatedConversation, botReply]; // Update conversation with bot's response
    
            setConversation(updatedConversationWithBotReply); // Set conversation state with updated conversation
            setMessage(''); // Clear message input after sending
        })
        .catch((error) => {
            console.error('Error:', error);
            setMessage(''); // Clear message input after sending
        });
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
                <div className="chat-container">
                    {conversation.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
                <div>
                    <input type="text" value={message} onChange={handleMessageChange} />
                    <button onClick={sendMessage}>Send</button>
                </div>
                <button onClick={handleGoBack}>Go Back</button>
            </div>
        </Layout>
        </>
    );
};

export default ChatPage;
// chat/[user2Id].js

import { useRouter } from 'next/router';
import Layout from '../../../../components/layout';
import React, { useState } from 'react';
import OpenAI from "openai";

const ChatPage = () => {
    const router = useRouter();
    const { user1Id, user2Id } = router.query;

    const handleGoBack = () => {
        router.push(`/bot/${user1Id}`);
    };

    const client = new OpenAI({ apiKey: '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', dangerouslyAllowBrowser: true });
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);

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
    );
};

export default ChatPage;

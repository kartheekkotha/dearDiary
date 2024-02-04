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
    const [name,setName]=useState("")
    const [name2,setName2]=useState("")
    const handleGoBack = () => {
        router.push(`/bot/${user1Id}`);
    };


    const client = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true });
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);
    const [diaryEntries, setDiaryEntries] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [queryHistory, setQueryHistory] = useState('');

    useEffect(() => {
        fetchUserName(user1Id ,user2Id);
        fetchDiaryEntries(user2Id);
        fetchBlogs(user2Id);
    }, [user2Id]);


    useEffect(() => {
        console.log(diaryEntries); // Log inside this useEffect
        console.log(blogs); // Log inside this useEffect
        let concatenatedString = '';
        for (let item of diaryEntries) {
            // Convert Firebase Timestamp to JavaScript Date object
            let date = item.createdAt.toDate();
    
            // Format the date as desired (date and time)
            let formattedDate = date.toLocaleDateString('en-US');
            let formattedTime = date.toLocaleTimeString('en-US');
    
            // Concatenate title, content, and formatted date and time
            let concatItem = `The Date this diary entry is created on : ${formattedDate}, at time Time: ${formattedTime}, and the title is ${item.title} and the content is ${item.content}`;
            concatenatedString += concatItem + '\n';
        }
        for (let item of blogs) {
            // Convert Firebase Timestamp to JavaScript Date object
            let date = item.createdAt.toDate();

            // Format the date as desired (date and time)
            let formattedDate = date.toLocaleDateString('en-US');
            let formattedTime = date.toLocaleTimeString('en-US');

            // Concatenate title, content, and formatted date and time
            let concatItem = `The Date this blog is created on : ${formattedDate}, at time Time: ${formattedTime}, and the title is ${item.title} and the content is ${item.content}`;
            concatenatedString += concatItem + '\n';
        }
        console.log(concatenatedString);
        setQueryHistory(concatenatedString);
    }, [diaryEntries]);
    
    const fetchUserName = async (user1Id , user2Id) => {
        try {
            const db = getFirestore();
            const userDoc = doc(db, 'users', user1Id);
            const userdocument = await getDoc(userDoc);
            if (userdocument.exists()) {
                const userData = userdocument.data();
                console.log(userData.displayName)
                setName(userData.username)
            } else {
                return null;
            }
            const db2 = getFirestore();
            const userDoc2 = doc(db2, 'users', user2Id);
            const userdocument2 = await getDoc(userDoc2);
            if (userdocument2.exists()) {
                const userData2 = userdocument2.data();
                console.log(userData2.displayName)
                setName2(userData2.username)
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching username:', error);
            return null;
        }
    };

    const fetchDiaryEntries = async (userId) => {
        try {
            const db = getFirestore();
            const diaryRef = collection(db, `users/${userId}/diaries`); // Reference to the diaries collection
            const snapshot = await getDocs(diaryRef); // Fetch documents from the collection
            const diaryData = snapshot.docs.map(doc => doc.data()); // Extract data from each document
            setDiaryEntries(diaryData); // Update state with diary entries
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
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const sendMessage = async () => {
        const userMessage = `Your Question is : ${message}`;
        const updatedConversation = [...conversation, userMessage]; // Update conversation with user's message
    
        const chunkSize = 90000; // Set the maximum chunk size
        const chunks = [];

        let finalQuery = `So,you will be my friend who have written the below diary entries and blogs, so answer like one when asked for and never mention anything like as a author of the dairy mentioned. like you are the author of them and the blogs or the thoughts you believe in, read this data but don't reply until I ask tell you everytime "Your Question is:" and answer the question when asked as someone who has experienced the above as author of the above text and is chatting with his/her friend"\n\n` + queryHistory + updatedConversation.join('\n');
        chunks.push(finalQuery);
        
        for (let i = 0; i < finalQuery.length; i += chunkSize) {
            chunks.push(finalQuery.slice(i, i + chunkSize)); // Split the message into chunks
        }
    
        try {
            console.log('no of chunks: ', chunks.length)
            let count = 0;
            for (let chunk of chunks) {
                count++;
                await client.chat.completions.create({
                    messages: [
                        { "role": "system", "content": "You are a helpful assistant." },
                        { "role": "user", "content": chunk },
                    ],
                    model: "gpt-3.5-turbo",
                }).then((response) => {
                    console.log('response', response);
                    const botReply = `${response.choices[0].message.content}`;
                    if(count === chunks.length) {
                        const updatedConversationWithBotReply = [...updatedConversation, botReply]; // Update conversation with bot's response
                        setConversation(updatedConversationWithBotReply); // Set conversation state with updated conversation
                        setMessage(''); // Clear message input after sending
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setMessage(''); // Clear message input after sending
                });
            }
            // After sending all chunks, fetch the final output of the API
            // const completion = await client.chat.completions.retrieve(); // Assuming this method exists to retrieve the final completion
            // const botReply = `${completion.choices[0].message.content}`;
            // const updatedConversationWithBotReply = [...updatedConversation, botReply]; // Update conversation with bot's response
            // setConversation(updatedConversationWithBotReply); // Set conversation state with updated conversation
            // setMessage(''); // Clear message input after sending
        } catch (error) {
            console.error('Error:', error);
            setMessage(''); // Clear message input after sending
        }
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
            {/* <div>
                <h1>Chat with {name2}</h1>
                <p>This is the chat page for {name}.</p>
                <div className="chat-container">
                    {conversation.map((msg, index) => (
                        <p key={index}>{msg}</p>
                    ))}
                </div>
                <div>
                    <input type="text" value={message} onChange={handleMessageChange} />
                    <button className='btn btn-primary animated-button' onClick={sendMessage}>Send</button>
                </div>
                <button className='btn btn-primary animated-button' onClick={handleGoBack}>Go Back</button>
            </div> */}
<div className="container" style={{ backgroundColor: '#cbd5e0' }}>
  <div className="row justify-content-center">
    <div className="col-md-8">
      <h1 className="text-muted">Chat with {name2}</h1>
      <p className="text-muted">This is the chat page for {name}.</p>
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <p key={index} className="text-muted">{msg}</p>
        ))}
      </div>
      <div className="input-group mt-3">
        <input type="text" className="form-control" value={message} onChange={handleMessageChange} />
        <div className="input-group-append">
          <button className='btn btn-primary' onClick={sendMessage}>Send</button>
        </div>
      </div>
      <div className="text-center mt-3">
        <button className='btn btn-primary' onClick={handleGoBack}>Go Back</button>
      </div>
    </div>
  </div>
</div>



        </Layout>
        </>
    );
};

export default ChatPage;
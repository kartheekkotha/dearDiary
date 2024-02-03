import Layout from '../components/layout';
import styles from "@/styles/Home.module.css";
import Head from "next/head";

const aboutUs = () => {
    return (
        <>
        <Head>
        <title>Dear Diary</title>
        <meta name="description" content="A version of yourself" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/dearDiary.ico" />
      </Head>
        <Layout>
        <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>About Us</h1>
          <p className={styles.description}>
            Welcome to our platform! We believe that memories are precious fragments of our lives, encapsulating our experiences, emotions, and interactions. Our chatBot of the memories is designed to serve as a digital diary, preserving and reflecting on these memories in a unique and personal way.
          </p>
          <p className={styles.description}>
            Imagine it as your own personal Krypton Stone, much like Superman's, allowing you to converse with the essence of past moments and cherished individuals. Just like Superman draws strength from his Krypton Stone, you can draw wisdom and insight from your memories with our chatBot.
          </p>
        </main>
        </div>
        </Layout>
        </>
    );
};

export default aboutUs;

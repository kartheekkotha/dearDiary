import Layout from '../components/layout';
import styles from "@/styles/Home.module.css";
import Head from "next/head";

const Contact = () => {
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
                    <h1 className={styles.title}>Contact Us</h1>
                    <div className={styles.contactDetails}>
                        <p className={styles.description}>
                            <span className={styles.bigText}>Meet Us at HackData Hackathon</span><br/>
                            <span className={styles.bigText}>Location : Shiv Nadar University</span> <br/>
                            <span className={styles.bigText}>Team Details:</span> <span className={styles.bigText}>Into the Unknown</span>
                        </p>
                    </div>
                </main>
            </div>
        </Layout>
        </>
    );
};

export default Contact;

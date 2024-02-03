import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Layout from "../components/layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
            <h1 className={styles.title}>Dear Diary</h1>
            <p className={styles.description}>
              A version of yourself, In the digital age, memories serve as
              invaluable data repositories. Leveraging cutting-edge Natural
              Language Processing (NLP) techniques, we propose a novel approach
              to construct personalized chatbots. By extracting and processing
              user memories through digital diary,we train chatbots to emulate
              users' experiences and knowledge. Through NLP processing,
              including sentiment analysis and topic modeling, the chatbots
              learn to generate contextually relevant responses to user queries.
              This innovative methodology not only enhances user engagement but
              also showcases the potential of using memories as memory banks to
              create AI-driven virtual assistants tailored to individual
              experiences and expertise.
            </p>
          </main>
        </div>
      </Layout>
    </>
  );
}

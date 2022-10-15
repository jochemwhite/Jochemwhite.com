import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Spotifylogin from "components/spotify/login/Spotifylogin";
import Webplayback from "components/spotify/webplayback/Webplayback";
import Add_to_queue from "components/spotify/queue/add_to_queue/Add_to_queue";
import Header from "components/Layout/Header/Header";

export default function Home() {
  const { Twitch, Spotify } = useContext(AuthContext);

  return (
    <div className={styles.container}>
      <Head>
        <title>Context-api with TypeScript and nextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <h1>Welcome {Twitch.username}</h1>

      {Spotify.auth ? (
        <>
          <Add_to_queue />
          <Webplayback />
        </>
      ) : (
        <Spotifylogin />
      )}
    </div>
  );
}

import Head from "next/head";
import s from "../styles/Home.module.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Spotifylogin from "components/spotify/login/Spotifylogin";
import Webplayback from "components/spotify/webplayback/Webplayback";
import Add_to_queue from "components/spotify/queue/add_to_queue/Add_to_queue";
import Queue from "components/spotify/queue/queue/Queue";
import { faTwitch } from "@fortawesome/free-brands-svg-icons";
import Welcome from "components/dashboard/welcome/Welcome";
import Header from "components/dashboard/header/Header";
import Statistics from "components/dashboard/statistics/Statistics";
import Goal from "components/dashboard/Goal/Goal";
import axios from "axios";

export default function Home() {
  const { Twitch, Spotify } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    async function fetchGoals() {
      let res = await axios.get("/api/twitch/goals");
      setGoals(res.data);
      console.log(goals)
    }
    fetchGoals()

    console.log('-------------------------------------------')
  }, []);

  return (
    <>
      <div className={s.container}>
        <div className={`${s.card} full_col`}>
          <Header
            username={Twitch.username}
            broadcaster_type={Twitch.broadcaster_type}
            profiel_img={Twitch.profiel_img}
          />
        </div>
        <div className={`${s.card} welcome ${s.welcome}`}>
          <Welcome username={Twitch.username} icon={faTwitch} />
        </div>

        <div className={`${s.card} statistics`}>
          <Statistics />
        </div>
        {goals!.map((goal: any) => {
          return <div className={`${s.card} box`}>
            <Goal 
              current_amount={goal.current_amount}
              target_amount={goal.target_amount}

            />
          </div>;
        })}
        {goals!.map((goal: any) => {
          return <div className={`${s.card} box`}>
            <Goal 
              current_amount={goal.current_amount}
              target_amount={goal.target_amount}

            />
          </div>;
        })}
        <div className={`${s.card} report`}>Revenue Report</div>
        <div className={`${s.card} welcome`}>
          {Spotify.auth ? (
            <>
              <Webplayback />
            </>
          ) : (
            <Spotifylogin />
          )}
        </div>
      </div>
    </>
  );
}

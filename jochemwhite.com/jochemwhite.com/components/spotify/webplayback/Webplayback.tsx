import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "context/AuthContext";
import s from "./Webplayback.module.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

const track = {
  name: "",
  id: "",
  album: {
    images: [{ url: "" }],
  },
  artists: [{ name: "" }],
};

function WebPlayback() {
  const { Spotify } = useContext(AuthContext);
  const [is_paused, setPaused] = useState<any>(false);
  const [is_active, setActive] = useState<any>(false);
  const [player, setPlayer] = useState<any>(undefined);
  const [current_track, setTrack] = useState<any>(track);
  const [loading, setLoading] = useState<boolean>(true);
  const [song, setSong] = useState<any>();
  const [deviceID, setDeviceID] = useState<string>();

  function playbackdevice() {
    axios.post("/api/spotify/playback", {
      deviceID: deviceID,
      accestoken: Spotify.accessToken,
    });
  }

  function refreshToken() {
    axios.post("/api/auth/spotify/refreshtoken", {
      refreshToken: Spotify.refreshToken,
    });
  }

  useEffect(() => {
    const script = document.createElement("script") as any;
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script) as any;

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const player = new (window as any).Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: any) => {
          cb(Spotify.accessToken);
        },
        volume: 0.5,
      }) as any;

      setPlayer(player);

      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setDeviceID(device_id);
        setLoading(false);
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener(
        "player_state_changed",
        (state: { track_window: { current_track: any } }) => {
          if (!state) {
            return;
          }

          setTrack(state.track_window.current_track);

          setActive(true);
        }
      );

      player.connect();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!is_active) {
    return (
      <>
        <div className="container">
          <div className="main-wrapper">
            <b>
              {" "}
              Instance not active. Transfer your playback using your Spotify app{" "}
              <button onClick={() => playbackdevice()}>Transfer</button>
            </b>
          </div>
        </div>
      </>
    );
  } else {
    if (song === current_track.id) {
    } else {
      setSong(current_track.id);
      console.log("new song");
      // removefromQueue(current_track.id);
    }

    return (
      <>
        <div className={s.container}>
          <div className={s.nowPlaying}>
            <div className={s.cover}>
              <img src={current_track.album.images[0].url} alt="Album" />
            </div>
            <div className={s.info}>
              <div className={s.title}>{current_track.name}</div>
              <div className={s.artist}>{current_track.artists[0].name}</div>
            </div>
          </div>
          <div className={s.controls}>
            <button
              className={s.control}
              onClick={() => player.previousTrack()}
            >
              <FontAwesomeIcon icon={faStepBackward} />
            </button>
            <button
              className={s.control}
              onClick={() => {
                if (is_paused) {
                  player.resume();
                  setPaused(false);
                } else {
                  player.pause();
                  setPaused(true);
                }
              }}
            >
              <FontAwesomeIcon icon={is_paused ? faPlay : faPause} />
            </button>
            <button className={s.control} onClick={() => player.nextTrack()}>
              <FontAwesomeIcon icon={faStepForward} />
            </button>
            
          </div>
        </div>
      </>
    );
  }
}

export default WebPlayback;

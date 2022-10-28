import React from "react";
import s from "./Spotifylogin.module.scss";

export default function Spotifylogin() {
  return (
    <>
      <div className={s.container}>
        <h2>You are not logged in to spotify!</h2>
        <p>if you would like to use spotify songreqeust please login</p>

        <a href="/api/auth/spotify" className={s.button}>
          login to spotify
        </a>
      </div>
    </>
  );
}

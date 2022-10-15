import React from "react";

export default function Spotifylogin() {
  return (
    <>
      <h2>You are not logged in to spotify!</h2>
      <p>if you would like to use spotify songreqeust login</p>
      <a href="/api/auth/spotify">
        <button>login to spotify</button>
      </a>
    </>
  );
}

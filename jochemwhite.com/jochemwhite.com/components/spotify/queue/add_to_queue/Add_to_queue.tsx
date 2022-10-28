import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";

export default function Add_to_queue() {
  const [trackID, setTrackID] = React.useState("");
  const { trackSet } = useContext(AuthContext);

  async function addtoQueue() {
    let res: AxiosResponse = await axios.post("/api/spotify/queue/add", {
      trackID: trackID,
      })
      trackSet()
  }



  return (
    <>
      <div>
        <h1>Add_to_queue</h1>
        <input type="text" onChange={(e) => setTrackID(e.target.value)}/>
        <button onClick={addtoQueue}>add to queue</button>
      </div>
    </>
  );
}

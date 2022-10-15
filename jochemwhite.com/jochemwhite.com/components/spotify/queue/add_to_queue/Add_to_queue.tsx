import axios, { AxiosResponse } from "axios";
import React from "react";

export default function Add_to_queue() {
  const [trackID, setTrackID] = React.useState("");

  async function addtoQueue() {
    console.log("add to queue");
    let res: AxiosResponse = await axios.post("/api/spotify/queue/add", {
      trackID: trackID,
      })
    // console.log(res);
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

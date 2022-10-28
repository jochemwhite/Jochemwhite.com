import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/router";
import axios from "axios";
import { v4 } from "uuid";

type Props = {
  children: ReactNode;
};

interface spotify {
  auth: boolean;
  SpotifyID: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    username: "",
    email: "",
    accesToken: "",
    refreshToken: "",
  });
  const [spotify, setSpotify] = useState<spotify>({
    auth: false,
    SpotifyID: 0,
    username: "",
    email: "",
    accessToken: "",
    refreshToken: "",
  });

  const [track, setTrack] = useState("");

  async function getTwitch() {
    const user = await fetch("/api/user/twitch");
    let json = await user.json();

    console.log(json)
    if (user.status === 401) {
      router.push("/login");
    }
    if (user.status === 200) {

      console.log(json)
      // router.push("/");
      setUser(json.user);
    }
  }

  async function getSpotify() {
    const user = await fetch("/api/user/spotify");
    let json = await user.json();

    if (user.status === 200) {
      setSpotify({
        auth: true,
        SpotifyID: json.user.id,
        username: json.user.display_name,
        email: json.user.email,
        accessToken: json.token,
        refreshToken: json.refreshToken,
      });
    }
  }

  function trackSet() {
    setTrack(v4());
  }

  useEffect(() => {
    getTwitch();
    getSpotify();


    console.log(user)
  }, []);

  return (
    <AuthContext.Provider
      value={{ Twitch: user, Spotify: spotify, track, trackSet }}
    >
      {children}
    </AuthContext.Provider>
  );
}

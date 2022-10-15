import { ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useRouter } from "next/router";
import axios from "axios";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    username: "",
    email: "",
    accesToken: "",
    refreshToken: "",
  });
  const [spotify, setSpotify] = useState<any>({
    auth: false,
    username: "",
    email: "",
    accesToken: "",
    refreshToken: "",
  });

  async function getTwitch() {
    const user = await fetch("/api/user/twitch");
    let json = await user.json();
    if (user.status === 401) {
      router.push("/login");
    }
    if (user.status === 200) {
      // router.push("/");
      setUser({
        username: json.user.username,
        email: json.user.email,
        accessToken: json.user.accessToken,
        refreshToken: json.user.refreshToken,
      });
    }
  }

  async function getSpotify() {
    const user = await fetch("/api/user/spotify");
    let json = await user.json();

    
    if (user.status === 200) {
      setSpotify({
        auth: true,
        username: json.user.username,
        email: json.user.email,
        accessToken: json.token,
      });
    }
  }

  useEffect(() => {
    getTwitch();
    getSpotify();
  }, []);

  return (
    <AuthContext.Provider value={{ Twitch: user, Spotify: spotify }}>
      {children}
    </AuthContext.Provider>
  );
}

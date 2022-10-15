import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitch
} from "@fortawesome/free-brands-svg-icons";
import s from "../styles/Login.module.scss";
export default function Login() {
  return (
    <div className={s.container}>
      <div className={s.action}>
        <h3>Login With your Twitch account</h3>
        <a href="/api/auth/twitch" className={s.iconContainer}>
          <span className={s.icon}>
            <FontAwesomeIcon icon={faTwitch} />
          </span>
        </a>
        <p>by login in you accept the terms of service</p>
      </div>
    </div>
  );
}

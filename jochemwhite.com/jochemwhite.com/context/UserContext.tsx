import { createContext } from "react";

interface AppContextInterface {
  username: string;
  email: string;
  accesToken: string;
}

const UserContext = createContext<AppContextInterface | null>(null);

export default UserContext;

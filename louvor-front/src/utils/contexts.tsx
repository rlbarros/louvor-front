import { User } from "@/models/auth/user.model";
import { createContext } from "react";

const AuthContext = createContext<Omit<User, "password">>(
  {} as Omit<User, "password">
);

export default AuthContext;

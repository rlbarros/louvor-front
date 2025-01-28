import { User } from "@/models/auth/user.model";
import { createContext } from "react";

export const AuthContext = createContext<Omit<User, "password">>(
  {} as Omit<User, "password">
);

export type CrudMode = "edit" | "save";

export type CrudContextState = {
  crudMode: CrudMode;
  setCrudMode: (crudMode: CrudMode) => void;
  crudId: number;
  setCrudId: (crudMode: number) => void;
};

const initialState: CrudContextState = {
  crudMode: "save",
  setCrudMode: () => null,
  crudId: 0,
  setCrudId: () => 0,
};

export const CrudContext = createContext<CrudContextState>(initialState);

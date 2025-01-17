import { Session } from "./session.model";

export type PartialSession = Omit<Session, "issued" | "expires">;
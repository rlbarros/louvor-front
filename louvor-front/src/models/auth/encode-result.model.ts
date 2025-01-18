import { User } from "./user.model"

export type EncodeResult = {
    success: boolean,
    token: string,
    expires: number,
    issued: number,
    user: Omit<User, 'password'>
}
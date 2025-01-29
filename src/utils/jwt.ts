import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt  from "jsonwebtoken";
import { SECRET } from "./env";

export interface IUserTokent extends Omit<User, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "username"> {
    id?: Types.ObjectId;
}

export const generateToken = (user: IUserTokent) => {
    const token = jwt.sign(user, SECRET, {
        expiresIn: "1h",
    });

    return token;
};

export const getUserData = (token: string): IUserTokent | null => {
    try {
        const user = jwt.verify(token, SECRET) as IUserTokent; // Pastikan tipe yang benar
        return user; // Kembalikan data user yang terverifikasi
    } catch (error) {
        console.error("Invalid token:", error);
        return null; // Return null jika token tidak valid
    }
};

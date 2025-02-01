import { Request, Response } from "express";
import * as Yup from 'yup';
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";

type TRegister = { 
    fullName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    identifier: string;
    password: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("password"), ""], "Password must be matched"),
});

export default {
    async register(req: Request, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.summary = 'Register user'
         #swagger.description = 'Endpoint untuk registrasi user baru'
         #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            fullName: { type: "string", example: "John Doe" },
                            username: { type: "string", example: "johndoe" },
                            email: { type: "string", example: "johndoe@example.com" },
                            password: { type: "string", example: "securepassword123" },
                            confirmPassword: { type: "string", example: "securepassword123" }
                        },
                        required: ["fullName", "username", "email", "password", "confirmPassword"]
                    }
                }
            }
         }
         #swagger.responses[201] = {
            description: "User berhasil didaftarkan",
            content: {
                "application/json": {
                    schema: {
                        message: "Success register",
                        data: { $ref: "#/components/schemas/User" }
                    }
                }
            }
         }
         #swagger.responses[400] = {
            description: "Kesalahan validasi data"
         }
         */
        
        const { fullName, username, email, password, confirmPassword } = req.body as unknown as TRegister;

        try {
            await registerValidateSchema.validate({
                fullName,
                username,
                email,
                password,
                confirmPassword,
            }); 

            const result = await UserModel.create({
                fullName,
                email,
                username,
                password,
            });

            res.status(201).json({
                message: "Success register",
                data: result
            });
            
        } catch (error) {
            const err = error as Error;

            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },

    async login(req: Request, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.summary = 'Login user'
         #swagger.description = 'Endpoint untuk login menggunakan email atau username'
         #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/loginRequest" }
                }
            }
         }
         #swagger.responses[200] = {
            description: "Login sukses",
            content: {
                "application/json": {
                    schema: {
                        message: "Login success",
                        data: "JWT Token"
                    }
                }
            }
         }
         #swagger.responses[403] = {
            description: "User tidak ditemukan atau password salah"
         }
         */
        
        const { identifier, password } = req.body as unknown as TLogin;

        try {
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    { email: identifier },
                    { username: identifier },
                ],
            });

            if (!userByIdentifier) {
                return res.status(403).json({
                    message: "User not found",
                    data: null,
                });
            }

            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return res.status(403).json({
                    message: "Invalid credentials",
                    data: null,
                });
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            res.status(200).json({
                message: "Login success",
                data: token,
            });

        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    },

    async me(req: IReqUser, res: Response) {
        /**
         #swagger.tags = ['Auth']
         #swagger.summary = 'Get user profile'
         #swagger.description = 'Mendapatkan profil pengguna berdasarkan token yang dikirim'
         #swagger.security = [{ "bearerAuth": {} }]
         #swagger.responses[200] = {
            description: "Berhasil mendapatkan profil user",
            content: {
                "application/json": {
                    schema: {
                        message: "Success get user profile",
                        data: { $ref: "#/components/schemas/User" }
                    }
                }
            }
         }
         #swagger.responses[401] = {
            description: "Unauthorized, token tidak valid atau tidak dikirim"
         }
         */
        
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user profile",
                data: result,
            });
        } catch (error) {
            const err = error as Error;
            res.status(400).json({
                message: err.message,
                data: null,
            });
        }
    }
};

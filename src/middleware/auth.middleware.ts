import { NextFunction, Request, Response } from "express";
import { getUserData, IUserTokent } from "../utils/jwt";


 export interface IReqUser extends Request {
    user?: IUserTokent;
 }


export default (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers?.authorization;


    if (!authorization) {
        return res.status(403).json({
            message: "unauthorized",
            data: null,
        });
    }

    const [prefix, token] = authorization.split(" ");

    if (!(prefix === "Bearer"  && token)) {
        return res.status(401).json({
            message: "unauthorized",
            data: null,
        });
    }


    // Verifikasi token dan ambil data user
    const user = getUserData(token);

    if (!user) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            data: null,
        });
    }


    (req as IReqUser).user = user;

    next();
};




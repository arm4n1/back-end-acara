import express from 'express';
import authController from "../controller/auth.controller";



const router = express.Router();

// router endpoint
router.post("/auth/register", authController.register);


export default router
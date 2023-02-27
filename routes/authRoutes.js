import express from "express";
const router = express.Router();
import { register,login, updateUser, getCurrentUser, logout } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js"
import testUser from '../middleware/testUser.js'

import rateLimiter from 'express-rate-limit'
import { get } from "mongoose";

const apiLimiter = rateLimiter({
    WindowsMS: 15 * 60 * 1000, //15 mins
    max: 10,
    message: 'Too many requests from this IP, try again in 15 minutes.'
})

router.route('/register').post(apiLimiter, register);
router.route('/login').post(apiLimiter, login);
router.route('/updateUser').patch(authenticateUser, testUser, updateUser);
router.route('/getCurrentUser').get(authenticateUser, getCurrentUser);
router.route('/logout').get(logout);

export default router
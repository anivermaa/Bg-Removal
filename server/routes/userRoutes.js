import express from 'express';
import { clerkWebhooks, paymentRazorpay, userCredit, verifyRazorpay } from '../controllers/UserController.js';
import authUser from '../middlewares/auth.js';

const userRouter = express.Router()

userRouter.post('/webhooks', clerkWebhooks)
userRouter.get('/credits', authUser, userCredit)
userRouter.post('/pay-razor',authUser,paymentRazorpay)
userRouter.post('/verify-razor',verifyRazorpay)


export default userRouter
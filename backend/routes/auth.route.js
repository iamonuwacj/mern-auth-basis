import express from 'express'
import { Login, Logout, Signup, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.get("/check-auth", verifyToken, checkAuth)

router.post("/signup", Signup)

router.post("/login", Login)

router.post("/logout", Logout)


router.post("/verify-email", verifyEmail)

router.post("/forgot-password", forgotPassword)

router.post("/reset-password/:token", resetPassword)

export default router
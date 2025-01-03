import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { User } from "../models/user.model.js"
import { GenerateVerificationCode } from "../utils/generateVerificationCode.js"
import { GenerateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js"
import { sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../SendMails/emails.js"


export const Signup = async (req, res) => {
    const { password, name, email } = req.body

    try {
        if(!email || !name || !password){
            throw new Error("All fields are required")
        }

        const UserAlreadyExist = await User.findOne({email})
        if(UserAlreadyExist) res.status(400).json({success: false, message: "User already exits"})

        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = GenerateVerificationCode()

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save()

        GenerateTokenandSetCookie(res, user._id)
        console.log(email, verificationToken);
        

        // sendVerificationEmail(email, verificationToken)


        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(400).json({success: true, message: error.message})
    }
}


// export const verifyEmail = async (req, res ) => {
//     const { code } = req.body

//     try {
//         const user = await User.findOne({
//             verificationToken: code,
//             verificationTokenExpiresAt: { $gt: Date.now() }
//         })

//         if (!user) res.status(400).json({success: false, message: "Invalid or expired verification code"})
//         console.log(user);
        
//         user.isVerified = true
//         user.verificationToken = undefined
//         user.verificationTokenExpiresAt = undefined

//         await user.save()

//         // await sendWelcomeEmail(user.email, user.name)
//         console.log(user.email, user.name);
        

//         res.status(201).json({
//             success: true,
//             message: "User Verified Successfully",
//             user: {
//                 ...user._doc,
//                 password: undefined,
//             }
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Verification failed",
//         })
//     }
// }


export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		// await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


export const Login = async (req, res) => {
    const { email, password } = req.body
    try {

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid Credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid){
            return res.status(400).json({success: false, message: "Invalid Password"})
        }

        GenerateTokenandSetCookie(res, user._id)

        user.lastLogin = new Date()

        await user.save()

        res.status(200).json({
            success: true,
            message: "Successfully logged in",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        console.log("Error in login", error);
        res.status(500).json({
            success: false,
            message: "Log in failed",
        })
    }
}



export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({success: false, message: "Email does not exist"})
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        // await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        console.log(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        

        res.status(200).json({ success: true, message: "Password reset link sent to your email"})

    } catch (error) {
        console.log("Error at forgot Password", error);
        res.status(500).json({
            success: false,
            message: "Passwor Reset failed"
        })
    }
}


export const resetPassword = async (req, res) => {

    try {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now()}
        })

        if(!user) res.status(400).json({success: false, message: "Invalid or expired token"})

        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword

        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()

        // await sendResetSuccessEmail(user.email)
        console.log("Reset Successfull", user.e);
        
        res.status(200).json({success: true, message: "Password reset successfully"})
        
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(500).json({success: false, message: error.message})
        
    }
}


export const Logout = async (req, res) => {
    res.clearCookie("token")

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
}


export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user) {
            return res.status(400).json({success: false, message: "User not found"})
        }

        res.status(200).json({success: true, user})
    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({success: false, message: error.message})
    }
}


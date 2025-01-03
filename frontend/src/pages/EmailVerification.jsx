import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const EmailVerification = () => {

    const [code, setCode] = useState(new Array(6).fill(""))
    const InputRef = useRef([])
    const [otpError, setOtpError] = useState(null)
    const [inpLength, setInpLength] = useState(null)
    const navigate = useNavigate()



    const { isLoading, error, verifyEmail, isAuthenticated } = useAuthStore()


    const handleChange = (index, value) => {

        const newCode = [...code]
        setOtpError(null)


        if (value.length > 1) {
            setInpLength(6)
            const pastedCode = value.slice(0, 6).split("")
            for(let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i]
            }
            setCode(newCode)

            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "")
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5

            InputRef.current[focusIndex].focus()

        } else {
            newCode[index] = value
            setCode(newCode)
            setInpLength(1)

            if(value && index < 5) {
                InputRef.current[index + 1].focus()
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const verificationCode = code.join("")

        try {
            await verifyEmail(verificationCode)
            navigate("/")
            toast.success("Email verified successfully");

        } catch (error) {
            console.log(error);
        }
    }


    const handleKeyDown = (index, e) => {
        setInpLength(1)
        if(e.key === "Backspace" && !code[index] && index > 0){
            InputRef.current[index - 1].focus()
        }
        if(e.key === "Enter" && !code[index] && index < code.length - 1){
            InputRef.current[index + 1].focus()
          }
    }

    useEffect(() => {
        if(isAuthenticated){
            setOtpError(null)
        }else {
            setOtpError(error)
        }
    }, [isAuthenticated, error])

    // if(code.every(digit => digit !== "")) {
    //          handleSubmit(new Event('submit'))
    // }


    // useEffect(() => {
    //     if(code.every(digit => digit !== "")) {
    //         handleSubmit(new Event('submit'))
    //     }
    // })



  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl
    rounded-2xl shadow-xl overflow-hidden'>
        <motion.div
            initial={{opacity:0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5}}
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl
            p-8 w-full max-w-md'
        >
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400
            to-emerald-500 text-transparent bg-clip-text'>
                Verify Your Email
            </h2>

            <p className='text-center text-gray-300 mb-6'>
                Enter the 6 digit code sent to your email address
            </p>

            <form className='space-y-6' onSubmit={handleSubmit}>
                <div className='flex justify-between'>
                    {code.map((digit, index) =>
                        <input
                            key={index}
                            ref={(el) => (InputRef.current[index] = el)}
                            type="text"
                            maxLength={inpLength}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white
                            border-2 border-gray-400 rounded-lg focus:border-green-500 focus:outline-none"
                        />
                    )}
                </div>

                { otpError && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                <motion.button
                    className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white
                    font-bold py-3 px-4 rounded-lg hover:to-emerald-700 focus:outline-none focus:ring-2
                    focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 1.05 }}
                    type='submit'
                    disabled={isLoading || code.some((digit) => !digit)}
                >
                    {isLoading ? "Verifying..." : "Verify Email"}
                </motion.button>
            </form>
        </motion.div>
    </div>
  )
}

export default EmailVerification
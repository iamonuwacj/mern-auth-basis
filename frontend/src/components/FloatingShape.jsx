import { motion } from 'framer-motion'


const FloatingShape = ({color, size, top, left, delay, right}) => {
    return (
    <motion.div
        className={`absolute rounded-full ${color} ${size} opacity-1 blur-xl`}
        style={{top, left, right}}
        animate={{
            y: ["0%", "100%", "0%"],
            x: ["0%", "100%", "0%"],
            rotate: [0, 360],
        }}

        transition={{
            duration: 5,
            ease: "linear",
            repeat: Infinity,
            delay,
        }}

        aria-hidden="true"
    />
  )
}

export default FloatingShape
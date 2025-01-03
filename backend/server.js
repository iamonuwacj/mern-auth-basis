import express from 'express'
import cookieParser from 'cookie-parser'
import { configDotenv } from 'dotenv'
import ConnectDB from './db/connectDB.js'
import authRoutes from './routes/auth.route.js'
import path from 'path'
import cors from 'cors'

configDotenv()

const app = express()
const PORT = process.env.PORT || 5055
const __dirname = path.resolve()

app.use(express.json())
app.use(cors({ origin: "http://localhost:3000", credentials: true}))
app.use(cookieParser())




//Create Routes Middleware
app.use("/api/auth", authRoutes)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "/frontend/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    })
}


app.listen(PORT, () => {
    ConnectDB()
    console.log(`Server running on http://localhost:${PORT}`);
})
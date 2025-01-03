import mongoose from "mongoose";


const ConnectDB = async () => {
    try {
        console.log("Mongo_Uri:", process.env.MONGO_ATLAS);
        const conn = await mongoose.connect(process.env.MONGO_ATLAS)
        console.log(`MongoDB connected ${conn.connection.host}`);
        
    } catch (error) {
        console.log("Error", error.message);
        process.exit(1)
    }
}

export default ConnectDB
import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`\n MongoDB connected !! DB HOST : ${conn}`);

    } catch (error) {
        console.log(`Mongo Db Connection err ${error}`);
        process.exit(1)
    }
}
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstence = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `database connected successfully !! DB host :${connectionInstence.connection.host}`
    );
  } catch (error) {
    console.log("mongo db connection error :", error);
    process.exit(1);
  }
};

export default connectDB;

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// load all env variables first when the program is started
dotenv.config({
  path: "./env",
});

// connect the database
connectDB().then(() => {
  app.on("error", () => {
    console.loc("error :".error);
    throw error;
  });

  app.listen(process.env.PORT || 8000, () => {
    console.log("port is listening on port :", process.env.PORT);
  });
});

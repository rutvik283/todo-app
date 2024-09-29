import { Router } from "express";
// import { upload } from "../middleweres/multer.middlewere.js";
import { loginUser, registerUser } from "../controllers/user.controler.js";
import multer from "multer";
const upload = multer({ dest: "./public/temp" });
const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

export default router;

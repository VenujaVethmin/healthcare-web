import { Router } from "express";
import { getProfile } from "../controllers/user.controller.js";


const userRoute = Router();

userRoute.get("/profile", getProfile);
// userRoute.put("/profile", updateProfile);


export default userRoute;

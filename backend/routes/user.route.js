import { Router } from "express";
import { findDoctors, getProfile, getUserBooking } from "../controllers/user.controller.js";


const userRoute = Router();

userRoute.get("/profile", getProfile);
userRoute.get("/doctors/:id", getUserBooking);

userRoute.get("/findDoctors", findDoctors);
// userRoute.post("/createAppointment", createNewAppointment);

export default userRoute;

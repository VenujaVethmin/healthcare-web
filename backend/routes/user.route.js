import { Router } from "express";
import { bookAppointment, findDoctors, getProfile, getUserBooking,  } from "../controllers/user.controller.js";


const userRoute = Router();

userRoute.get("/profile", getProfile);
userRoute.post("/doctors/:id",getUserBooking);

userRoute.get("/findDoctors", findDoctors);
userRoute.post("/bookAppoitnment", bookAppointment);
;
// userRoute.post("/createAppointment", createNewAppointment);

export default userRoute;

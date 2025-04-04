import { Router } from "express";
import { bookAppointment, calender, findDoctors, getProfile, getUserBooking,  } from "../controllers/user.controller.js";


const userRoute = Router();

userRoute.get("/profile", getProfile);
userRoute.get("/calender", calender);


userRoute.get("/findDoctors", findDoctors);
userRoute.post("/doctors/:id",getUserBooking);

userRoute.post("/bookAppoitnment", bookAppointment);
;
// userRoute.post("/createAppointment", createNewAppointment);

export default userRoute;

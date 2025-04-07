import { Router } from "express";
import { bookAppointment, calender, dashboard, findDoctors, getPrescription, getProfile, getUserBooking, updateProfile,  } from "../controllers/user.controller.js";


const userRoute = Router();

userRoute.get("/profile", getProfile);
userRoute.put("/profile", updateProfile);
userRoute.get("/calender", calender);;
userRoute.get("/getPrescription", getPrescription);
userRoute.get("/dashboard", dashboard);
;


userRoute.get("/findDoctors", findDoctors);
userRoute.post("/doctors/:id",getUserBooking);

userRoute.post("/bookAppoitnment", bookAppointment);
;
// userRoute.post("/createAppointment", createNewAppointment);

export default userRoute;

import { Router } from "express";
import { bookAppointment, calender, dashboard, findDoctors, getPrescription, getProfile, getProfilebyid, getUserBooking, medicalRecords, updateProfile,  } from "../controllers/user.controller.js";


const userRoute = Router();

userRoute.get("/profile", getProfile);
userRoute.get("/profile/:id", getProfilebyid);
userRoute.get("/medicalRecords", medicalRecords);
userRoute.put("/profile", updateProfile);;
userRoute.get("/calender", calender);;
userRoute.get("/getPrescription", getPrescription);
userRoute.get("/dashboard", dashboard);



userRoute.get("/findDoctors", findDoctors);
userRoute.post("/doctors/:id",getUserBooking);

userRoute.post("/bookAppoitnment", bookAppointment);
;
// userRoute.post("/createAppointment", createNewAppointment);

export default userRoute;

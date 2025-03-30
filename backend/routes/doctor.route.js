import { Router } from "express";
import { getProfile, updateAppointment } from "../controllers/doctor.controller.js";


const doctorRoute = Router();

doctorRoute.get("/profile", getProfile);
// doctorRoute.put("/profile", updateProfile);
doctorRoute.put("/updateAppointment/:id", updateAppointment);

export default doctorRoute;

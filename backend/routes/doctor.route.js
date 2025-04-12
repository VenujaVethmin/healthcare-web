import { Router } from "express";
import { calender,getProfileById, createPrescription, dashboard, getProfile, updateAppointment, updateProfile } from "../controllers/doctor.controller.js";


const doctorRoute = Router();

doctorRoute.get("/profile", getProfile);
doctorRoute.get("/profile/:id", getProfileById);
doctorRoute.put("/profile", updateProfile);
doctorRoute.get("/calender", calender);

doctorRoute.get("/dashboard", dashboard);
doctorRoute.post("/createPrescription", createPrescription);
doctorRoute.put("/updateAppointment/:id", updateAppointment);

export default doctorRoute;

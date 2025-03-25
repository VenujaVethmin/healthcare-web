import { Router } from "express";
import { getProfile } from "../controllers/doctor.controller.js";


const doctorRoute = Router();

doctorRoute.get("/profile", getProfile);
// doctorRoute.put("/profile", updateProfile);


export default doctorRoute;

import { Router } from "express";
import { doctorList, doctorSchedule, findUserByEmail, makeDoctor, updateDoctorSchedule } from "../controllers/admin.controller.js";



const adminRoute = Router();

adminRoute.get("/getDoctors", doctorList);
adminRoute.get("/getDoctorSchedule", doctorSchedule);

adminRoute.get("/getUserById/:email", findUserByEmail);

adminRoute.post("/changeRole", makeDoctor);
adminRoute.put("/updateDoctorSchedule/:id", updateDoctorSchedule);



export default adminRoute;

import { Router } from "express";
import { dashboard, doctorList, doctorSchedule, findUserByEmail, makeDoctor, updateDoctorSchedule, updatePublishStatus } from "../controllers/admin.controller.js";



const adminRoute = Router();


adminRoute.get("/dashboard", dashboard);
adminRoute.get("/getDoctors", doctorList);
adminRoute.get("/getDoctorSchedule", doctorSchedule);

adminRoute.get("/getUserById/:email", findUserByEmail);

adminRoute.post("/changeRole", makeDoctor);
adminRoute.put("/updatePublishStatus/:id", updatePublishStatus);
adminRoute.put("/updateDoctorSchedule/:id", updateDoctorSchedule);



export default adminRoute;

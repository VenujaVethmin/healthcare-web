import { Router } from "express";
import { doctorList, findUserByEmail, makeDoctor } from "../controllers/admin.controller.js";



const adminRoute = Router();

adminRoute.get("/getDoctors", doctorList);

adminRoute.get("/getUserById/:email", findUserByEmail);

adminRoute.post("/changeRole", makeDoctor);



export default adminRoute;

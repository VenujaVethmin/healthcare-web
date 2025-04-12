import { Router } from "express";

import { getUserInfo, pharmacistDashboard, pStatusChange } from "../controllers/pharmacist.controller.js";



const pharmacistRoute = Router();


pharmacistRoute.get("/dashboard", pharmacistDashboard);
pharmacistRoute.get("/userInfo/:email", getUserInfo);

pharmacistRoute.put("/pstatus/:id", pStatusChange);



export default pharmacistRoute;

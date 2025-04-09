import { Router } from "express";

import { pharmacistDashboard, pStatusChange } from "../controllers/pharmacist.controller.js";



const pharmacistRoute = Router();


pharmacistRoute.get("/dashboard", pharmacistDashboard);
pharmacistRoute.put("/pstatus/:id", pStatusChange);



export default pharmacistRoute;

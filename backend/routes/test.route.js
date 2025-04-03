import { Router } from "express";
import { getUserBooking } from "../controllers/test.controller.js";


const testRoute = Router();

testRoute.get("/test/:id", getUserBooking);


export default testRoute;

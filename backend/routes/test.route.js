import { Router } from "express";
import { test } from "../controllers/test.controller.js";


const testRoute = Router();

testRoute.post("/test", test);


export default testRoute;

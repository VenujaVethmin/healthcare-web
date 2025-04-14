import { Router } from "express";
import { test } from "../controllers/test.controller.js";


const testRoute = Router();

testRoute.get("/test", test);


export default testRoute;

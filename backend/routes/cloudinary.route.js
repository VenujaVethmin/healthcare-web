import { Router } from "express";
import { uploadImage } from "../controllers/cloudinary.controller.js";


const cloudinaryRoute = Router();

cloudinaryRoute.post("/profileImage", uploadImage);


export default cloudinaryRoute;

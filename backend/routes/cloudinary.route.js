import { Router } from "express";
import { pharmacistFileUpload, uploadImage } from "../controllers/cloudinary.controller.js";


const cloudinaryRoute = Router();

cloudinaryRoute.post("/profileImage", uploadImage);
cloudinaryRoute.post("/fileUpload/:id", pharmacistFileUpload);

export default cloudinaryRoute;

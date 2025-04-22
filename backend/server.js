import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import passport from "passport";
import { ensureJWTAuth } from "./middleware/jwtAuth.js";
import adminRoute from "./routes/admin.route.js";
import cloudinaryRoute from "./routes/cloudinary.route.js";
import doctorRoute from "./routes/doctor.route.js";
import pharmacistRoute from "./routes/pharmacist.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";

import jwt from "jsonwebtoken";

import "./services/passport.js";

const prisma = new PrismaClient();
dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL,
  })
);




app.use(passport.initialize());


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ error: "name, email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) return res.status(500).json({ error: "Something went wrong" });
    if (!user) return res.status(401).json({ error: info?.message });

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  })(req, res, next);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = generateToken(req.user);
   
      res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/token?token=${token}`);
  }
);

// app.get("/api/logout", (req, res) => {
//   // Client should handle token deletion.
//   res
//     .status(200)
//     .json({ message: "Logged out on client side. Token deleted." });
// });


app.get("/api/me", ensureJWTAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.use("/api/user",ensureJWTAuth, userRoute);
app.use("/api/doctor", ensureJWTAuth,doctorRoute);
app.use("/api/admin",ensureJWTAuth, adminRoute);
app.use("/api/test", ensureJWTAuth,testRoute);
app.use("/api/pharmacist", ensureJWTAuth,pharmacistRoute);
app.use("/api/cloudinary",ensureJWTAuth, cloudinaryRoute);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

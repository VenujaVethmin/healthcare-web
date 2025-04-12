import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import session from "express-session";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import passport from "passport";
import { ensureAuthenticated } from "./middleware/auth.js";
import adminRoute from "./routes/admin.route.js";
import cloudinaryRoute from "./routes/cloudinary.route.js";
import doctorRoute from "./routes/doctor.route.js";
import pharmacistRoute from "./routes/pharmacist.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
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
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      httpOnly: true, // Prevents XSS attacks
      secure: true, // Set to true if using HTTPS
      sameSite: "none", // Prevents CSRF attacks
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

app.post("/auth/login", async (req, res) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (error) => {
      if (error) {
        return res.status(500).json({ error: "Something went wrong" });
      }

      return res
        .status(200)
        .json({ id: user._id, name: user.name, email: user.email });
    });
  })(req, res);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: false }),
  (req, res) => {
    res.redirect(process.env.NEXT_PUBLIC_FRONTEND_URL);
  }
);

app.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }

    res.status(204).send();
  });
});

app.get("/me", ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    image:req.user.image
  });
});

app.use("/api/user", userRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/test", testRoute);
app.use("/api/pharmacist", pharmacistRoute);
app.use("/api/cloudinary", cloudinaryRoute);

app.listen(3001, () => {
  console.log("Server started on port 3001");
});

import { Hono } from "hono";
import * as authController from "./auth.controller.ts";

const authRoutes = new Hono();

// Register new user
authRoutes.post("/register", authController.registerUser);

// Login user
authRoutes.post("/login", authController.loginUser);

export default authRoutes;

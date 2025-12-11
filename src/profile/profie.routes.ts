// src/features/profile/profile.routes.ts
import { Hono } from "hono";
import * as ProfileController from "./profile.controller.ts";

const profileRoutes = new Hono();

// Profile routes
profileRoutes.get("/profile/:user_id", ProfileController.getProfile);
profileRoutes.put("/profile/:user_id", ProfileController.updateProfile);
profileRoutes.get("/profile/:user_id/activity", ProfileController.getUserActivity);
profileRoutes.get("/profile/:user_id/complete", ProfileController.getCompleteProfile);
profileRoutes.post("/profile/:user_id/password", ProfileController.changePassword);

// Optional: If you want to add profile picture feature later
profileRoutes.post("/profile/setup-picture", ProfileController.setupProfilePicture);
profileRoutes.post("/profile/:user_id/picture", ProfileController.uploadProfilePicture);

export default profileRoutes;
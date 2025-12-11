import { Hono } from "hono";
import * as DashboardController from "./dashboarddata.controller.ts";

const DashboardRoutes = new Hono();

// Admin route (all stats)
DashboardRoutes.get("/admin-dashboard", DashboardController.getAdminDashboardStats);

// User route (user-specific stats)
DashboardRoutes.get("/dashboard/:user_id", DashboardController.getUserDashboardStats);

export default DashboardRoutes;

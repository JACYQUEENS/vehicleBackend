import * as DashboardService from "./dashboardData.service.ts";


// Admin Dashboard Controller

export const getAdminDashboardStats = async (c: any) => {
  try {
    const stats = await DashboardService.getAdminDashboardStatsService();
    return c.json(stats);
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};


// User Dashboard Controller

export const getUserDashboardStats = async (c: any) => {
  try {
    const user_id = parseInt(c.req.param("user_id"));
    const stats = await DashboardService.getUserDashboardStatsService(user_id);
    return c.json(stats);
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

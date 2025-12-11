import { getDbPool } from "../database/db.config.ts";


// Admin Dashboard Stats

export const getAdminDashboardStatsService = async () => {
  const db = getDbPool();

  // Total vehicles
  const totalVehiclesRes = await db.request().query(`SELECT COUNT(*) AS totalVehicles FROM Vehicles`);
  const totalVehicles = totalVehiclesRes.recordset[0].totalVehicles;

  // Total revenue (sum of approved bookings)
  const totalRevenueRes = await db
    .request()
    .query(`SELECT ISNULL(SUM(total_amount),0) AS totalRevenue FROM Bookings WHERE booking_status='approved'`);
  const totalRevenue = totalRevenueRes.recordset[0].totalRevenue;

  // Total customers
  const totalCustomersRes = await db.request().query(`SELECT COUNT(*) AS totalCustomers FROM Users WHERE role='user'`);
  const totalCustomers = totalCustomersRes.recordset[0].totalCustomers;

  return { totalVehicles, totalRevenue, totalCustomers };
};


// User Dashboard Stats

export const getUserDashboardStatsService = async (user_id: number) => {
  const db = getDbPool();

  // User bookings
  const bookingsRes = await db
    .request()
    .input("user_id", user_id)
    .query(`SELECT * FROM Bookings WHERE user_id=@user_id ORDER BY booking_date DESC`);
  const bookings = bookingsRes.recordset;

  // Total spent by user (approved bookings)
  const totalSpentRes = await db
    .request()
    .input("user_id", user_id)
    .query(`SELECT ISNULL(SUM(total_amount),0) AS totalSpent FROM Bookings WHERE user_id=@user_id AND booking_status='approved'`);
  const totalSpent = totalSpentRes.recordset[0].totalSpent;

  return { bookings, totalSpent };
};

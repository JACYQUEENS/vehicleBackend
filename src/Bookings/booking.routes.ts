// src/features/bookings/bookings.routes.ts
import { Hono } from "hono";
import * as BookingController from "./booking.controller.ts";

const bookingRoutes = new Hono();

// CREATE BOOKING
bookingRoutes.post("/bookings", BookingController.createBooking);

// GET ALL BOOKINGS (Admin)
bookingRoutes.get("/bookings/get", BookingController.getAllBookings);

// GET BOOKINGS BY USER ID
bookingRoutes.get("/bookings/users/:user_id", BookingController.getBookingsByUserId);

// GET SINGLE BOOKING
bookingRoutes.get("/bookings/:booking_id", BookingController.getBookingById);

// UPDATE & DELETE
bookingRoutes.put("/bookings/:booking_id", BookingController.updateBooking);
bookingRoutes.delete("/bookings/:booking_id", BookingController.deleteBooking);

// APPROVE, COMPLETE, CANCEL
bookingRoutes.put("/bookings/:booking_id/approve", BookingController.approveBooking);
bookingRoutes.put("/bookings/:booking_id/complete", BookingController.completeBooking);
bookingRoutes.put("/bookings/:booking_id/cancel", BookingController.cancelBooking);

export default bookingRoutes;

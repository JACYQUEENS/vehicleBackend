import { Hono } from "hono";
import * as BookingController from './booking.controller.ts';

const BookingRoutes = new Hono();

// CREATE BOOKING
BookingRoutes.post("/bookings", BookingController.createBooking);

// GET ALL BOOKINGS
BookingRoutes.get("/bookings", BookingController.getAllBookings);

// GET BOOKING BY ID
BookingRoutes.get("/bookings/:booking_id", BookingController.getBookingById);

// UPDATE BOOKING
BookingRoutes.put("/bookings/:booking_id", BookingController.updateBooking);

// DELETE BOOKING
BookingRoutes.delete("/bookings/:booking_id", BookingController.deleteBooking);

export default BookingRoutes;

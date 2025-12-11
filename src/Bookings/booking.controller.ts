// src/features/bookings/bookings.controller.ts
import type { Context } from "hono";
import * as BookingService from "./bookings.service.ts";

export const createBooking = async (c: Context) => {
  try {
    const body = await c.req.json();
    const created = await BookingService.createBookingService({
      user_id: Number(body.user_id),
      vehicle_id: Number(body.vehicle_id),
      booking_date: body.booking_date,
      return_date: body.return_date,
      total_amount: Number(body.total_amount),
      booking_status: body.booking_status ?? "pending",
    });
    return c.json({ message: "Booking created successfully", booking: created }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to create booking" }, 500);
  }
};

// export const getAllBookings = async (c: Context) => {
//   try {
//     const bookings = await BookingService.getAllBookingsService();
//     return c.json(bookings, 200);
//   } catch (err) {
//     return c.json({ error: "Failed to fetch bookings" }, 500);
//   }
// };


// ===========================
// GET ALL BOOKINGS - SIMPLE VERSION
// ===========================
export const getAllBookings = async (c: Context) => {
  try {
    console.log("📞 [CONTROLLER] GET /bookings called (simple version)");
    
    // Call the simple service
    const bookings = await BookingService.getAllBookingsService();
    
    console.log(`✅ [CONTROLLER] Returning ${bookings.length} bookings`);
    
    // Return the array directly
    return c.json(bookings, 200);
    
  } catch (err: any) {
    console.error("❌ [CONTROLLER] Error in getAllBookings:", {
      message: err.message,
      name: err.name
    });
    
    return c.json({ 
      success: false,
      error: "Failed to fetch bookings",
      details: err.message
    }, 500);
  }
};

export const getBookingsByUserId = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    const bookings = await BookingService.getBookingsByUserIdService(user_id);
    return c.json(bookings, 200);
  } catch (err) {
    return c.json({ error: "Failed to fetch user bookings" }, 500);
  }
};

export const getBookingById = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const booking = await BookingService.getBookingByIdService(booking_id);
    if (!booking) return c.json({ error: "Booking not found" }, 404);
    return c.json({ booking }, 200);
  } catch (err) {
    return c.json({ error: "Failed to fetch booking" }, 500);
  }
};

export const updateBooking = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const body = await c.req.json();
    const updated = await BookingService.updateBookingService(booking_id, {
      user_id: Number(body.user_id),
      vehicle_id: Number(body.vehicle_id),
      booking_date: body.booking_date,
      return_date: body.return_date,
      total_amount: Number(body.total_amount),
      booking_status: body.booking_status,
    });
    return c.json({ message: "Booking updated", booking: updated }, 200);
  } catch (err) {
    return c.json({ error: "Failed to update booking" }, 500);
  }
};

export const deleteBooking = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const ok = await BookingService.deleteBookingService(booking_id);
    if (!ok) return c.json({ error: "Booking not found or could not be deleted" }, 404);
    return c.json({ message: "Booking deleted" }, 200);
  } catch (err) {
    return c.json({ error: "Failed to delete booking" }, 500);
  }
};

export const approveBooking = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const updated = await BookingService.approveBookingService(booking_id);
    return c.json({ message: "Booking approved", booking: updated }, 200);
  } catch (err) {
    return c.json({ error: "Failed to approve booking" }, 500);
  }
};

export const completeBooking = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const body = await c.req.json();
    const vehicle_id = Number(body.vehicle_id);
    const updated = await BookingService.completeBookingService(booking_id, vehicle_id);
    return c.json({ message: "Booking completed", booking: updated }, 200);
  } catch (err) {
    return c.json({ error: "Failed to complete booking" }, 500);
  }
};

export const cancelBooking = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const updated = await BookingService.cancelBookingService(booking_id);
    return c.json({ message: "Booking cancelled", booking: updated }, 200);
  } catch (err) {
    return c.json({ error: "Failed to cancel booking" }, 500);
  }
};

import { type Context } from "hono";
import * as BookingService from "./bookings.service.ts";


// GET ALL BOOKINGS

export const getAllBookings = async (c: Context) => {
    try {
        const data = await BookingService.getAllBookings();

        if (data.length === 0)
            return c.json({ message: "No bookings found" }, 404);

        return c.json(data);

    } catch (error: any) {
        console.log("Error fetching bookings:", error.message);
        return c.json({ error: "Failed to fetch bookings" }, 500);
    }
};


// GET BOOKING BY ID

export const getBookingById = async (c: Context) => {
    const booking_id = parseInt(c.req.param("booking_id"));

    try {
        const result = await BookingService.getBookingById(booking_id);

        if (result === null)
            return c.json({ error: "Booking not found" }, 404);

        return c.json(result);

    } catch (error) {
        console.log("Error fetching booking:", error);
        return c.json({ error: "internal server error" }, 500);
    }
};


// CREATE BOOKING
export const createBooking = async (c: Context) => {
    try {
        const body = await c.req.json() as {
            user_id:number,
             vehicle_id:number, 
             booking_date:string, 
             return_date:string, 
             total_amount:number
        };

        const message = await BookingService.createBooking(
           body. user_id,
            body.vehicle_id,
           body. booking_date,
            body.return_date,
            body.total_amount
        );
        if(message==='failed to create bookings'){
            return c.json({error:'successfullycreated'},201)
        }

    } catch (error) {
        console.log("Error creating booking:", error);
        return c.json({ error: "internal server error" }, 500);
    }
};


// UPDATE BOOKING
export const updateBooking = async (c: Context) => {
    try {
        const booking_id = parseInt(c.req.param("booking_id"));
        const body = await c.req.json();

        const exists = await BookingService.getBookingById(booking_id);
        if (exists === null)
            return c.json({ error: "Booking not found" }, 404);

        const updated = await BookingService.updateBooking(
            booking_id,
            body.user_id,
            body.vehicle_id,
            body.booking_date,
            body.return_date,
            body.total_amount,
            body.booking_status
        );

        return c.json({ message: "Booking updated successfully", updated_booking: updated });

    } catch (error) {
        console.log("Error updating booking:", error);
        return c.json({ error: "internal server error" }, 500);
    }
};


// DELETE BOOKING
export const deleteBooking = async (c: Context) => {
    const booking_id = parseInt(c.req.param("booking_id"));

    try {
        const exists = await BookingService.getBookingById(booking_id);

        if (exists === null)
            return c.json({ error: "Booking not found" }, 404);

        const message = await BookingService.deleteBooking(booking_id);

        return c.json({ message });

    } catch (error) {
        console.log("Error deleting booking:", error);
        return c.json({ error: "internal server error" }, 500);
    }
};

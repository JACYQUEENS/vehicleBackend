import { type Context } from "hono";
import * as TicketServices from "./SupportTickets.service.ts";

// GET ALL TICKETS
export const getAllTickets = async (c: Context) => {
    try {
        const result = await TicketServices.getAllTickets();
        if (!result.length) return c.json({ message: "No tickets found" }, 404);

        return c.json(result);
    } catch (err) {
        return c.json({ error: "Failed to fetch tickets" }, 500);
    }
};

// GET ONE TICKET
export const getTicketById = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));

    try {
        const ticket = await TicketServices.getTicketById(ticket_id);
        if (!ticket) return c.json({ error: "Ticket not found" }, 404);

        return c.json(ticket);
    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

// CREATE TICKET
export const createTicket = async (c: Context) => {
    try {
        const { user_id, subject, description } = await c.req.json();

        if (!user_id || !subject || !description) {
            return c.json({ error: "All fields are required" }, 400);
        }

        const message = await TicketServices.createTicket(user_id, subject, description);

        return c.json({ message }, 201);
    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

// UPDATE TICKET
export const updateTicket = async (c: Context) => {
    try {
        const ticket_id = parseInt(c.req.param("ticket_id"));
        const { subject, description, status } = await c.req.json();

        const exists = await TicketServices.getTicketById(ticket_id);
        if (!exists) return c.json({ error: "Ticket not found" }, 404);

        const updated = await TicketServices.updateTicket(
            ticket_id,
            subject,
            description,
            status
        );

        return c.json({ message: "Ticket updated successfully", updated }, 200);

    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

// DELETE TICKET
export const deleteTicket = async (c: Context) => {
    const ticket_id = parseInt(c.req.param("ticket_id"));

    try {
        const exists = await TicketServices.getTicketById(ticket_id);
        if (!exists) return c.json({ error: "Ticket not found" }, 404);

        const message = await TicketServices.deleteTicket(ticket_id);

        return c.json({ message }, 200);
    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

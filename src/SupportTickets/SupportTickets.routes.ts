import { Hono } from "hono";
import * as TicketController from "./SupportTickets.controller.ts";

const SupportTicketRoutes = new Hono();

//GETTING ALL TICKETCS
SupportTicketRoutes.get("/tickets", TicketController.getAllTickets);

////GETTING TICKETCS BY ID
SupportTicketRoutes.get("/tickets/:ticket_id", TicketController.getTicketById);

//CREATING A TICKETC
SupportTicketRoutes.post("/tickets", TicketController.createTicket);

//UPDATING A TICKET
SupportTicketRoutes.put("/tickets/:ticket_id", TicketController.updateTicket);

//DELETING A TICKET
SupportTicketRoutes.delete("/tickets/:ticket_id", TicketController.deleteTicket);

export default SupportTicketRoutes;

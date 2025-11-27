import { getDbPool } from '../database/db.config.ts'

export interface SupportTicketResponse {
    ticket_id: number;
    user_id: number;
    subject: string;
    description: string;
    status: string;
    created_at: Date;
    updated_at: Date | null;

    user?: {
        name: string;
        email: string;
        phone_number?: string;
    }
}

// GET ALL TICKETS
export const getAllTickets = async (): Promise<SupportTicketResponse[]> => {
    const db = getDbPool();

    const query = `
        SELECT 
            t.*,
            (u.first_name + ' ' + u.last_name) AS user_name,
            u.email AS user_email,
            u.phone_number AS user_phone
        FROM SupportTickets t
        INNER JOIN Users u ON t.user_id = u.user_id
        ORDER BY t.created_at DESC
    `;

    const result = await db.request().query(query);

    return result.recordset.map(row => ({
        ticket_id: row.ticket_id,
        user_id: row.user_id,
        subject: row.subject,
        description: row.description,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,

        user: {
            name: row.user_name,
            email: row.user_email,
            phone_number: row.user_phone
        }
    }));
};

// GET TICKET BY ID
export const getTicketById = async (ticket_id: number): Promise<SupportTicketResponse | null> => {
    const db = getDbPool();

    const query = `
        SELECT 
            t.*,
            (u.first_name + ' ' + u.last_name) AS user_name,
            u.email AS user_email,
            u.phone_number AS user_phone
        FROM SupportTickets t
        INNER JOIN Users u ON t.user_id = u.user_id
        WHERE t.ticket_id = @ticket_id
    `;

    const result = await db.request()
        .input("ticket_id", ticket_id)
        .query(query);

    if (!result.recordset.length) return null;

    const row = result.recordset[0];

    return {
        ticket_id: row.ticket_id,
        user_id: row.user_id,
        subject: row.subject,
        description: row.description,
        status: row.status,
        created_at: row.created_at,
        updated_at: row.updated_at,

        user: {
            name: row.user_name,
            email: row.user_email,
            phone_number: row.user_phone
        }
    };
};

// CREATE TICKET
export const createTicket = async (
    user_id: number,
    subject: string,
    description: string
): Promise<string> => {

    const db = getDbPool();

    const query = `
        INSERT INTO SupportTickets (user_id, subject, description)
        VALUES (@user_id, @subject, @description)
    `;

    const result = await db.request()
        .input("user_id", user_id)
        .input("subject", subject)
        .input("description", description)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Support ticket created successfully 🎉"
        : "Failed to create ticket";
};

// UPDATE TICKET
export const updateTicket = async (
    ticket_id: number,
    subject: string,
    description: string,
    status: string
): Promise<SupportTicketResponse | null> => {
    
    const db = getDbPool();

    const query = `
        UPDATE SupportTickets
        SET subject=@subject,
            description=@description,
            status=@status,
            updated_at=GETDATE()
        WHERE ticket_id=@ticket_id
    `;

    await db.request()
        .input("ticket_id", ticket_id)
        .input("subject", subject)
        .input("description", description)
        .input("status", status)
        .query(query);

    return await getTicketById(ticket_id);
};

// DELETE TICKET
export const deleteTicket = async (ticket_id: number): Promise<string> => {
    const db = getDbPool();

    const result = await db.request()
        .input("ticket_id", ticket_id)
        .query("DELETE FROM SupportTickets WHERE ticket_id=@ticket_id");

    return result.rowsAffected[0] === 1
        ? "Support ticket deleted successfully 🎊"
        : "Failed to delete ticket";
};

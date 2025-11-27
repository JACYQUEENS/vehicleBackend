import { getDbPool } from '../database/db.config.ts'

// Payment Response Interface
interface PaymentResponse {
    payment_id: number;
    booking_id: number;
    amount: number;
    payment_status: string;
    payment_date: Date;
    payment_method: string;
    transaction_id?: string | null;
}

// GET ALL PAYMENTS
export const getAllPayments = async (): Promise<PaymentResponse[]> => {
    const db = getDbPool();

    const query = `
        SELECT *
        FROM Payments
        ORDER BY payment_date DESC
    `;

    const result = await db.request().query(query);
    return result.recordset;
};

// GET PAYMENT BY ID
export const getPaymentById = async (payment_id: number): Promise<PaymentResponse | null> => {
    const db = getDbPool();

    const query = `
        SELECT *
        FROM Payments
        WHERE payment_id = @payment_id
    `;

    const result = await db.request()
        .input("payment_id", payment_id)
        .query(query);

    return result.recordset.length ? result.recordset[0] : null;
};

// CREATE PAYMENT
export const createPayment = async (
    booking_id: number,
    amount: number,
    payment_method: string,
    transaction_id?: string
): Promise<string> => {
    const db = getDbPool();

    const query = `
        INSERT INTO Payments 
        (booking_id, amount, payment_method, transaction_id)
        VALUES (@booking_id, @amount, @payment_method, @transaction_id)
    `;

    const result = await db.request()
        .input("booking_id", booking_id)
        .input("amount", amount)
        .input("payment_method", payment_method)
        .input("transaction_id", transaction_id ?? null)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Payment created successfully 🎉"
        : "Failed to create payment";
};

// UPDATE PAYMENT
export const updatePayment = async (
    payment_id: number,
    booking_id: number,
    amount: number,
    payment_status: string,
    payment_method: string,
    transaction_id?: string
): Promise<PaymentResponse | null> => {

    const db = getDbPool();

    const query = `
        UPDATE Payments
        SET booking_id=@booking_id,
            amount=@amount,
            payment_status=@payment_status,
            payment_method=@payment_method,
            transaction_id=@transaction_id
        WHERE payment_id=@payment_id
    `;

    await db.request()
        .input("payment_id", payment_id)
        .input("booking_id", booking_id)
        .input("amount", amount)
        .input("payment_status", payment_status)
        .input("payment_method", payment_method)
        .input("transaction_id", transaction_id ?? null)
        .query(query);

    return await getPaymentById(payment_id);
};

// DELETE PAYMENT
export const deletePayment = async (payment_id: number): Promise<string> => {
    const db = getDbPool();

    const result = await db.request()
        .input("payment_id", payment_id)
        .query("DELETE FROM Payments WHERE payment_id=@payment_id");

    return result.rowsAffected[0] === 1
        ? "Payment deleted successfully 🎊"
        : "Failed to delete payment";
};

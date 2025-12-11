
// import { getDbPool, PAYSTACK_KEY } from "../database/db.config.ts";
// import fetch from "node-fetch";

// export interface PaymentData {
//   payment_id?: number;
//   booking_id: number;
//   amount: number;
//   payment_status?: string;
//   payment_date?: string | Date;
//   payment_method?: string;
//   transaction_id?: string;
// }

// interface PaystackResponse {
//   status: boolean;
//   message: string;
//   data: {
//     amount: number;
//     [key: string]: unknown;
//   };
// }

// // CREATE PAYMENT
// export const createPaymentService = async (data: PaymentData) => {
//   const db = getDbPool();
//   const query = `
//     INSERT INTO Payments (
//       booking_id,
//       amount,
//       payment_status,
//       payment_date,
//       payment_method,
//       transaction_id,
//       created_at
//     )
//     OUTPUT INSERTED.*
//     VALUES (
//       @booking_id,
//       @amount,
//       @payment_status,
//       GETDATE(),
//       @payment_method,
//       @transaction_id,
//       GETDATE()
//     )
//   `;
//   const result = await db.request()
//     .input("booking_id", data.booking_id)
//     .input("amount", data.amount)
//     .input("payment_status", data.payment_status ?? "pending")
//     .input("payment_method", data.payment_method ?? "paystack")
//     .input("transaction_id", data.transaction_id ?? null)
//     .query(query);

//   return result.recordset[0];
// };

// // GET ALL PAYMENTS
// export const getAllPaymentsService = async () => {
//   const db = getDbPool();
//   const query = `
//     SELECT 
//       p.*,
//       b.user_id,
//       b.vehicle_id,
//       b.total_amount AS booking_total,
//       b.booking_status
//     FROM Payments p
//     INNER JOIN Bookings b ON p.booking_id = b.booking_id
//     ORDER BY p.created_at DESC
//   `;
//   const result = await db.request().query(query);
//   return result.recordset;
// };

// // GET PAYMENT BY ID
// export const getPaymentByIdService = async (payment_id: number) => {
//   const db = getDbPool();
//   const query = `
//     SELECT 
//       p.*,
//       b.user_id,
//       b.vehicle_id,
//       b.total_amount AS booking_total,
//       b.booking_status
//     FROM Payments p
//     INNER JOIN Bookings b ON p.booking_id = b.booking_id
//     WHERE p.payment_id=@payment_id
//   `;
//   const result = await db.request()
//     .input("payment_id", payment_id)
//     .query(query);

//   return result.recordset[0] ?? null;
// };

// // GET PAYMENTS BY USER ID
// export const getPaymentsByUserIdService = async (user_id: number) => {
//   const db = getDbPool();
//   const query = `
//     SELECT 
//       p.*,
//       b.user_id,
//       b.vehicle_id,
//       b.total_amount AS booking_total,
//       b.booking_status
//     FROM Payments p
//     INNER JOIN Bookings b ON p.booking_id = b.booking_id
//     WHERE b.user_id=@user_id
//     ORDER BY p.created_at DESC
//   `;
//   const result = await db.request()
//     .input("user_id", user_id)
//     .query(query);

//   return result.recordset;
// };

// // UPDATE PAYMENT
// export const updatePaymentService = async (payment_id: number, data: PaymentData) => {
//   const db = getDbPool();
//   const query = `
//     UPDATE Payments
//     SET 
//       amount=@amount,
//       payment_status=@payment_status,
//       updated_at=GETDATE()
//     OUTPUT INSERTED.*
//     WHERE payment_id=@payment_id
//   `;
//   const result = await db.request()
//     .input("payment_id", payment_id)
//     .input("amount", data.amount)
//     .input("payment_status", data.payment_status ?? "pending")
//     .query(query);

//   return result.recordset[0];
// };

// // DELETE PAYMENT
// export const deletePaymentService = async (payment_id: number) => {
//   const db = getDbPool();
//   const result = await db.request()
//     .input("payment_id", payment_id)
//     .query("DELETE FROM Payments WHERE payment_id=@payment_id");

//   return result.rowsAffected[0] === 1;
// };

// // VERIFY PAYMENT VIA PAYSTACK
// export const verifyPaymentService = async (booking_id: number, reference: string) => {
//   // Verify payment using Paystack API
//   const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//     headers: {
//       Authorization: `Bearer ${PAYSTACK_KEY}`,
//       "Content-Type": "application/json"
//     }
//   });

//   const data = (await res.json()) as PaystackResponse;

//   if (!data.status) throw new Error(data.message || "Payment verification failed");

//   // Save/update payment in database
//   const db = getDbPool();
//   const query = `
//     UPDATE Payments
//     SET 
//       payment_status='success',
//       transaction_id=@transaction_id,
//       payment_date=GETDATE(),
//       updated_at=GETDATE()
//     OUTPUT INSERTED.*
//     WHERE booking_id=@booking_id
//   `;
//   const result = await db.request()
//     .input("booking_id", booking_id)
//     .input("transaction_id", reference)
//     .query(query);

//   // If payment record does not exist, create one
//   if (result.recordset.length === 0) {
//     return await createPaymentService({
//       booking_id,
//       amount: data.data.amount / 100,
//       payment_status: "success",
//       transaction_id: reference,
//       payment_method: "paystack"
//     });
//   }

//   return result.recordset[0];
// };
import { getDbPool, PAYSTACK_KEY } from "../database/db.config.ts";
import fetch from "node-fetch";
import PDFDocument from "pdfkit";

export interface PaymentData {
  payment_id?: number;
  booking_id: number;
  amount: number;
  payment_status?: string;
  payment_date?: string | Date;
  payment_method?: string;
  transaction_id?: string;
}

// Paystack API response
interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    [key: string]: unknown;
  };
}

// CREATE PAYMENT
export const createPaymentService = async (data: PaymentData) => {
  const db = getDbPool();
  const query = `
    INSERT INTO Payments (
      booking_id,
      amount,
      payment_status,
      payment_date,
      payment_method,
      transaction_id,
      created_at
    )
    OUTPUT INSERTED.*
    VALUES (
      @booking_id,
      @amount,
      @payment_status,
      GETDATE(),
      @payment_method,
      @transaction_id,
      GETDATE()
    )
  `;
  const result = await db.request()
    .input("booking_id", data.booking_id)
    .input("amount", data.amount)
    .input("payment_status", data.payment_status ?? "pending")
    .input("payment_method", data.payment_method ?? "paystack")
    .input("transaction_id", data.transaction_id ?? null)
    .query(query);

  return result.recordset[0];
};

// GET ALL PAYMENTS
export const getAllPaymentsService = async () => {
  const db = getDbPool();
  const query = `
    SELECT 
      p.*,
      b.user_id,
      b.vehicle_id,
      b.total_amount AS booking_total,
      b.booking_status
    FROM Payments p
    INNER JOIN Bookings b ON p.booking_id = b.booking_id
    ORDER BY p.created_at DESC
  `;
  const result = await db.request().query(query);
  return result.recordset;
};

// GET PAYMENT BY ID
export const getPaymentByIdService = async (payment_id: number) => {
  const db = getDbPool();
  const query = `
    SELECT 
      p.*,
      b.user_id,
      b.vehicle_id,
      b.total_amount AS booking_total,
      b.booking_status
    FROM Payments p
    INNER JOIN Bookings b ON p.booking_id = b.booking_id
    WHERE p.payment_id=@payment_id
  `;
  const result = await db.request()
    .input("payment_id", payment_id)
    .query(query);

  return result.recordset[0] ?? null;
};

// GET PAYMENTS BY USER ID
export const getPaymentsByUserIdService = async (user_id: number) => {
  const db = getDbPool();
  const query = `
    SELECT 
      p.*,
      b.user_id,
      b.vehicle_id,
      b.total_amount AS booking_total,
      b.booking_status
    FROM Payments p
    INNER JOIN Bookings b ON p.booking_id = b.booking_id
    WHERE b.user_id=@user_id
    ORDER BY p.created_at DESC
  `;
  const result = await db.request()
    .input("user_id", user_id)
    .query(query);

  return result.recordset;
};

// UPDATE PAYMENT
export const updatePaymentService = async (payment_id: number, data: PaymentData) => {
  const db = getDbPool();
  const query = `
    UPDATE Payments
    SET 
      amount=@amount,
      payment_status=@payment_status,
      updated_at=GETDATE()
    OUTPUT INSERTED.*
    WHERE payment_id=@payment_id
  `;
  const result = await db.request()
    .input("payment_id", payment_id)
    .input("amount", data.amount)
    .input("payment_status", data.payment_status ?? "pending")
    .query(query);

  return result.recordset[0];
};

// DELETE PAYMENT
export const deletePaymentService = async (payment_id: number) => {
  const db = getDbPool();
  const result = await db.request()
    .input("payment_id", payment_id)
    .query("DELETE FROM Payments WHERE payment_id=@payment_id");

  return result.rowsAffected[0] === 1;
};

// VERIFY PAYMENT VIA PAYSTACK
export const verifyPaymentService = async (booking_id: number, reference: string) => {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_KEY}`,
      "Content-Type": "application/json"
    }
  });

  const data = (await res.json()) as PaystackResponse;

  if (!data.status) throw new Error(data.message || "Payment verification failed");

  const db = getDbPool();
  const query = `
    UPDATE Payments
    SET 
      payment_status='paid',
      transaction_id=@transaction_id,
      payment_date=GETDATE(),
      updated_at=GETDATE()
    OUTPUT INSERTED.*
    WHERE booking_id=@booking_id
  `;
  const result = await db.request()
    .input("booking_id", booking_id)
    .input("transaction_id", reference)
    .query(query);

  if (result.recordset.length === 0) {
    return await createPaymentService({
      booking_id,
      amount: data.data.amount / 100,
      payment_status: "paid",
      transaction_id: reference,
      payment_method: "paystack"
    });
  }

  return result.recordset[0];
};

// GET RECEIPT DATA
export const getReceiptDataService = async (booking_id: number) => {
  const db = getDbPool();
  const query = `
    SELECT 
      p.transaction_id,
      p.amount,
      p.payment_date,
      b.booking_id,
      b.booking_date,
      b.booking_status,
      u.email
    FROM Payments p
    INNER JOIN Bookings b ON p.booking_id = b.booking_id
    INNER JOIN Users u ON b.user_id = u.user_id
    WHERE b.booking_id=@booking_id
      AND p.payment_status='paid'
  `;
  const result = await db.request()
    .input("booking_id", booking_id)
    .query(query);

  return result.recordset[0] ?? null;
};

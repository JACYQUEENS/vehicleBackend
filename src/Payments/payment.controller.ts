

import type { Context } from "hono";
import * as PaymentService from "./payments.service.ts";
import PDFDocument from "pdfkit";

// CREATE PAYMENT
export const createPayment = async (c: Context) => {
  try {
    const body = await c.req.json();
    const payment = await PaymentService.createPaymentService({
      booking_id: Number(body.booking_id),
      amount: Number(body.amount),
      payment_status: body.payment_status,
      payment_method: body.payment_method,
      transaction_id: body.transaction_id
    });
    return c.json({ message: "Payment created successfully", payment }, 201);
  } catch (err: any) {
    console.error(err);
    return c.json({ error: err.message || "Failed to create payment" }, 500);
  }
};

// GET ALL PAYMENTS
export const getAllPayments = async (c: Context) => {
  try {
    const payments = await PaymentService.getAllPaymentsService();
    return c.json(payments);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch payments" }, 500);
  }
};

// GET PAYMENT BY ID
export const getPaymentById = async (c: Context) => {
  try {
    const payment_id = Number(c.req.param("payment_id"));
    const payment = await PaymentService.getPaymentByIdService(payment_id);
    if (!payment) return c.json({ error: "Payment not found" }, 404);
    return c.json(payment);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch payment" }, 500);
  }
};

// GET PAYMENTS BY USER ID
export const getPaymentsByUserId = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    const payments = await PaymentService.getPaymentsByUserIdService(user_id);
    return c.json(payments);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch user payments" }, 500);
  }
};

// UPDATE PAYMENT
export const updatePayment = async (c: Context) => {
  try {
    const payment_id = Number(c.req.param("payment_id"));
    const body = await c.req.json();
    const updated = await PaymentService.updatePaymentService(payment_id, {
      amount: Number(body.amount),
      payment_status: body.payment_status,
      booking_id: 0
    });
    return c.json({ message: "Payment updated successfully", payment: updated });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to update payment" }, 500);
  }
};

// DELETE PAYMENT
export const deletePayment = async (c: Context) => {
  try {
    const payment_id = Number(c.req.param("payment_id"));
    const deleted = await PaymentService.deletePaymentService(payment_id);
    if (!deleted) return c.json({ error: "Payment not found" }, 404);
    return c.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to delete payment" }, 500);
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { booking_id, reference } = body;
    const payment = await PaymentService.verifyPaymentService(Number(booking_id), reference);
    return c.json({ success: true, message: "Payment verified", payment });
  } catch (err: any) {
    console.error(err);
    return c.json({ success: false, message: err.message || "Payment verification failed" }, 500);
  }
};

// DOWNLOAD RECEIPT
export const downloadReceipt = async (c: Context) => {
  try {
    const booking_id = Number(c.req.param("booking_id"));
    const data = await PaymentService.getReceiptDataService(booking_id);
    if (!data) return c.json({ error: "Receipt not found" }, 404);

    const doc = new PDFDocument();

    c.header("Content-Type", "application/pdf");
    c.header("Content-Disposition", `attachment; filename=receipt-${booking_id}.pdf`);

    const stream = new ReadableStream({
      start(controller) {
        doc.on("data", (chunk) => controller.enqueue(chunk));
        doc.on("end", () => controller.close());
      }
    });

    doc.fontSize(22).text("Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Booking ID: ${data.booking_id}`);
    doc.text(`Transaction Ref: ${data.transaction_id}`);
    doc.text(`Customer Email: ${data.email}`);
    doc.text(`Booking Date: ${new Date(data.booking_date).toDateString()}`);
    doc.text(`Payment Date: ${new Date(data.payment_date).toDateString()}`);
    doc.text(`Amount Paid: KES ${data.amount}`);
    doc.text(`Status: ${data.booking_status}`);
    doc.moveDown();
    doc.text("Thank you for your payment!", { align: "center" });

    doc.end();

    return new Response(stream, { headers: c.res.headers });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to generate receipt" }, 500);
  }
};
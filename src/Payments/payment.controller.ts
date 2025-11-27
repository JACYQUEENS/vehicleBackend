import {  type Context } from "hono";
import * as PaymentServices from './payments.service.ts'

// GET ALL PAYMENTS
export const getAllPayments = async (c: Context) => {
    try {
        const result = await PaymentServices.getAllPayments();
        if (!result.length) return c.json({ message: "No payments found" }, 404);

        return c.json(result);
    } catch (err) {
        console.log("Error:", err);
        return c.json({ error: "Failed to fetch payments" }, 500);
    }
};

// GET PAYMENT BY ID
export const getPaymentById = async (c: Context) => {
    const payment_id = parseInt(c.req.param("payment_id"));

    try {
        const result = await PaymentServices.getPaymentById(payment_id);
        if (!result) return c.json({ error: "Payment not found" }, 404);

        return c.json(result);
    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

// CREATE PAYMENT
export const createPayment = async (c: Context) => {
    try {
        const body=await c.req.json() as {
            booking_id:number,
            amount:number,
            payment_method:string,
            transaction_id:string
        };
       


        const message = await PaymentServices.createPayment(
            body.booking_id,
            body.amount,
            body.payment_method,
            body.transaction_id
        );
        if(message==='failed to create vehicle specification'){
            return c.json  ({error:'failed to create'})
         }
         return c.json({message:'Successfully created '})}
     catch (error:any) {
         console.log("Error in creating payments:", error.message);
        
        return c.json({ error: "Internal server error" }, 500);
    }
};

// UPDATE PAYMENT
export const updatePayment = async (c: Context) => {
    try {
        const payment_id = parseInt(c.req.param("payment_id"));
        const body = await c.req.json();

        const exists = await PaymentServices.getPaymentById(payment_id);
        if (!exists) return c.json({ error: "Payment not found" }, 404);

        const updated = await PaymentServices.updatePayment(
            payment_id,
            body.booking_id,
            body.amount,
            body.payment_status,
            body.payment_method,
            body.transaction_id
        );

        return c.json({ message: "Payment updated", updated }, 200);

    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

// DELETE PAYMENT
export const deletePayment = async (c: Context) => {
    const payment_id = parseInt(c.req.param("payment_id"));
    try {
        const exists = await PaymentServices.getPaymentById(payment_id);
        if (!exists) return c.json({ error: "Payment not found" }, 404);

        const message = await PaymentServices.deletePayment(payment_id);
        return c.json({ message }, 200);
    } catch (err) {
        return c.json({ error: "Internal server error" }, 500);
    }
};

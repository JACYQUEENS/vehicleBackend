import { Hono } from "hono";
import * as PaymentController from './payment.controller.ts'

const PaymentRoutes = new Hono();
//GETTING ALL PAYMENTS
PaymentRoutes.get("/payments", PaymentController.getAllPayments);

//GETTING PAYMENTS BY ID
PaymentRoutes.get("/payments/:payment_id", PaymentController.getPaymentById);

//CREATING PAYMENT
PaymentRoutes.post("/payments", PaymentController.createPayment);

//UPDATING PAYMENTS
PaymentRoutes.put("/payments/:payment_id", PaymentController.updatePayment);

//DELETING PAYMENTS
PaymentRoutes.delete("/payments/:payment_id", PaymentController.deletePayment);

export default PaymentRoutes;

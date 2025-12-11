
// import { Hono } from "hono";
// import {
//   createPayment,
//   getPaymentById,
//   getAllPayments,
//   getPaymentsByUserId,
//   updatePayment,
//   deletePayment,
//   verifyPayment
// } from "./payment.controller.ts";

// const paymentRoute = new Hono();

// // CREATE
// paymentRoute.post("/payments", createPayment);

// // GET ALL
// paymentRoute.get("/payments", getAllPayments);

// // GET BY USER ID
// paymentRoute.get("/user/:user_id", getPaymentsByUserId);

// // GET BY PAYMENT ID
// paymentRoute.get("/:payment_id", getPaymentById);

// // UPDATE
// paymentRoute.put("/:payment_id", updatePayment);

// // DELETE
// paymentRoute.delete("/:payment_id", deletePayment);

// // VERIFY PAYMENT
// paymentRoute.post("/payments/verify", verifyPayment);

// export default paymentRoute;



import { Hono } from "hono";
import {
  createPayment,
  getPaymentById,
  getAllPayments,
  getPaymentsByUserId,
  updatePayment,
  deletePayment,
  verifyPayment,
  downloadReceipt
} from "./payment.controller.ts";

const paymentRoute = new Hono();

// CREATE
paymentRoute.post("/payments", createPayment);

// GET ALL
paymentRoute.get("/payments", getAllPayments);

// GET BY USER ID
paymentRoute.get("/user/:user_id", getPaymentsByUserId);

// DOWNLOAD RECEIPT
paymentRoute.get("/receipt/:booking_id", downloadReceipt);

// GET BY PAYMENT ID
paymentRoute.get("/:payment_id", getPaymentById);

// UPDATE
paymentRoute.put("/payments:payment_id", updatePayment);

// DELETE
paymentRoute.delete("/:payment_id", deletePayment);

// VERIFY PAYMENT
paymentRoute.post("/payments/verify", verifyPayment);

export default paymentRoute;

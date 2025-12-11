import { serve } from '@hono/node-server';
import { type Context, Hono } from 'hono';
import  initDatabaseConnection  from './database/db.config.js'
import {logger} from 'hono/logger'
import { prometheus } from '@hono/prometheus'
import { cors } from 'hono/cors';
import VehicleSpecRoutes from './VehicleSpeciffication/vehiclespecification.routes.ts';
import VehicleRoutes from './Vehicles/vehicle.routes.ts';
import UserRoutes from './Users/users.routes.ts';
import SupportTicketRoutes from './SupportTickets/SupportTickets.routes.ts';
import PaymentRoutes from './Payments/payments.routes.ts';
// import BookingRoutes from './Bookings/booking.routes.ts';
import authRoutes from './Auth/auth.routes.ts';
import DashboardRoutes from './dashboarddata/dashboarddata.routes.ts'
import bookingRoutes from './Bookings/booking.routes.ts';
import profileRoutes from './profile/profie.routes.ts';

const app = new Hono();
app.use('*',cors());
//app.use(logger);
//prometheus middleware
const {printMetrics, registerMetrics} =  prometheus()

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'vehicle system management'
    
  });
});

// API routes
app.get('/api', (c:Context) => {
  return c.json({
    message: 'Welcome to our vehicle system management. How can we help you?',
    
  },200);
});


// 404 handler
app.notFound((c: Context) => {
  return c.json({
    success: false,
    message: 'Route not found',
    path: c.req.path
  }, 404);
});

// Mount API routes
// app.route("/api", vehicle vetting);
app.route("api", VehicleSpecRoutes);
app.route("api", VehicleRoutes);
app.route("api", UserRoutes);
app.route("api", SupportTicketRoutes);
app.route("api", PaymentRoutes);
// app.route("api", BookingRoutes);
app.route("api", bookingRoutes);
app.route("api",authRoutes);
app.route("api",DashboardRoutes);
app.route("api",profileRoutes);

const port = Number(process.env.PORT) || 4000;


// Establish DB connection and then start the server
initDatabaseConnection()
  .then(() => {
    // Start the server only after DB connection is established
    serve({
      fetch: app.fetch,
      port
    }, (info) => {
      console.log(`🚀 Server is running on http://localhost:${info.port}`);
    })
  }).catch((error) => {
    console.error('Failed to initialize database connection:', error);
  });



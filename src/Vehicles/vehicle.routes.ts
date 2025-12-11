// import { Hono } from "hono";
// import * as VehicleController from './vehicle.controller.ts'

// const VehicleRoutes = new Hono();

// // CREATE VEHICLE
// VehicleRoutes.post("/vehicles", VehicleController.createVehicle);

// // GET ALL VEHICLES
// VehicleRoutes.get("/vehicles", VehicleController.getAllVehicles);

// // GET VEHICLE BY ID
// VehicleRoutes.get("/vehicles/:vehicle_id", VehicleController.getVehicleById);

// // UPDATE VEHICLE
// VehicleRoutes.put("/vehicles/:vehicle_id", VehicleController.updateVehicle);

// // DELETE VEHICLE
// VehicleRoutes.delete("/vehicles/:vehicle_id", VehicleController.deleteVehicle);

// export default VehicleRoutes;


// src/Vehicles/vehicle.routes.ts
import { Hono } from "hono";
import * as VehicleController from './vehicle.controller.ts';

const vehicleRoutes = new Hono();

// CREATE VEHICLE
vehicleRoutes.post("/vehicles", VehicleController.createVehicle);

// GET ALL VEHICLES
vehicleRoutes.get("/vehicles", VehicleController.getAllVehicles);

// GET VEHICLE BY ID
vehicleRoutes.get("/vehicles/:vehicle_id", VehicleController.getVehicleById);

// UPDATE VEHICLE
vehicleRoutes.put("/vehicles/:vehicle_id", VehicleController.updateVehicle);

// DELETE VEHICLE
vehicleRoutes.delete("/vehicles/:vehicle_id", VehicleController.deleteVehicle);

// ✅ Default export for easy import in index.ts
export default vehicleRoutes;

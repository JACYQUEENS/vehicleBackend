import { Hono } from "hono";
import * as VehicleController from './vehicle.controller.ts'

const VehicleRoutes = new Hono();

// CREATE VEHICLE
VehicleRoutes.post("/vehicles", VehicleController.createVehicle);

// GET ALL VEHICLES
VehicleRoutes.get("/vehicles", VehicleController.getAllVehicles);

// GET VEHICLE BY ID
VehicleRoutes.get("/vehicles/:vehicle_id", VehicleController.getVehicleById);

// UPDATE VEHICLE
VehicleRoutes.put("/vehicles/:vehicle_id", VehicleController.updateVehicle);

// DELETE VEHICLE
VehicleRoutes.delete("/vehicles/:vehicle_id", VehicleController.deleteVehicle);

export default VehicleRoutes;

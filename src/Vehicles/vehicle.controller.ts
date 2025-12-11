// import { type Context } from "hono";
// import * as VehicleServices from './vehicle.service.ts'
// // GET ALL VEHICLES

// export const getAllVehicles = async (c: Context) => {
//     try {
//         const result = await VehicleServices.getAllVehicles();

//         if (result.length === 0) {
//             return c.json({ message: "No vehicles found" }, 404);
//         }

//         return c.json(result);

//     } catch (error: any) {
//         console.log("Error fetching vehicles:", error.message);
//         return c.json({ error: "Failed to fetch vehicles" }, 500);
//     }
// };

// //  GET VEHICLE BY ID
// export const getVehicleById = async (c: Context) => {
//     const vehicle_id = parseInt(c.req.param("vehicle_id"));

//     try {
//         const result = await VehicleServices.getVehicleById(vehicle_id);

//         if (result === null) {
//             return c.json({ error: "Vehicle not found" }, 404);
//         }

//         return c.json(result);

//     } catch (error) {
//         console.log("Error fetching vehicle:", error);
//         return c.json({ error: "Internal server error" }, 500);
//     }
// };
// // CREATE VEHICLE
// export const createVehicle = async (c: Context) => {
//     try {
//         const body = await c.req.json() as { vehicleSpec_id:number, rental_rate: string, availability: string, image_url:string};

// const message=await VehicleServices.createVehicle (body.vehicleSpec_id, body.rental_rate, body.availability, body.image_url);

//    if (message==='Failed to create vehicle') {
//             return c.json({ error: "failed to create a vehicle" }, 400)
//         }
//         return c.json({ message:'Vehicle created successfully 🚗🎉 '}, 201);

//     } catch (error) {
//         console.log("Error creating vehicle:", error);
//         return c.json({ error: "Internal server error" }, 500);
//     }
// };

// //  UPDATE VEHICLE

// export const updateVehicle = async (c: Context) => {
//     try {
//         const vehicle_id = parseInt(c.req.param("vehicle_id"));
//         const body = await c.req.json();

//         const checkExists = await VehicleServices.getVehicleById(vehicle_id);

//         if (checkExists === null) {
//             return c.json({ error: "Vehicle not found" }, 404);
//         }

//         const result = await VehicleServices.updateVehicle(
//             vehicle_id,
//             body.vehicleSpec_id,
//             body.rental_rate,
//             body.availability,
//             body.image_url
//         );

//         return c.json({
//             message: "Vehicle updated successfully",
//             updated_vehicle: result
//         }, 200);

//     } catch (error) {
//         console.log("Error updating vehicle:", error);
//         return c.json({ error: "Internal server error" }, 500);
//     }
// };


// //  DELETE VEHICLE
// export const deleteVehicle = async (c: Context) => {
//     const vehicle_id = parseInt(c.req.param("vehicle_id"));

//     try {
//         const check = await VehicleServices.getVehicleById(vehicle_id);

//         if (check === null) {
//             return c.json({ error: "Vehicle not found" }, 404);
//         }

//         const message = await VehicleServices.deleteVehicle(vehicle_id);

//         return c.json({
//             message: "Vehicle deleted successfully",
//             deleted_vehicle: message
//         }, 200);

//     } catch (error) {
//         console.log("Error deleting vehicle:", error);
//         return c.json({ error: "Internal server error" }, 500);
//     }
// };

// src/controllers/vehicles.controller.ts
import type { Context } from "hono";
import * as VehicleService from "./vehicle.service.ts";
import { error } from "console";

// ===========================
// CREATE VEHICLE
// ===========================
export const createVehicle = async (c: Context) => {
  try {
    const body = await c.req.json();
    const created = await VehicleService.createVehicleService({
      vehicleSpec_id: Number(body.vehicleSpec_id),
      rental_rate: body.rental_rate,
      availability: body.availability ?? "true",
      image_url: body.image_url ?? null,
    });

    return c.json(
      { message: "Vehicle created successfully", vehicle: created },
      201
    );
  } catch (err: any) {
    console.error(err);
    return c.json({ error: err.message || "Failed to create vehicle" }, 500);
  }
};

// ===========================
// GET ALL VEHICLES
// ===========================
export const getAllVehicles = async (c: Context) => {
  try {
    const vehicles = await VehicleService.getAllVehiclesService();
    return c.json(vehicles);
  } catch (err) {
    return c.json({ error: "Failed to fetch vehicles" }, 500);
  }
};

// ===========================
// GET VEHICLE BY ID
// ===========================
export const getVehicleById = async (c: Context) => {
  try {
    const vehicle_id = Number(c.req.param("vehicle_id"));
    const vehicle = await VehicleService.getVehicleByIdService(vehicle_id);

    if (!vehicle) return c.json({ error: "Vehicle not found" }, 404);

    return c.json(vehicle);
  } catch (err) {
    return c.json({ error: "Failed to fetch vehicle" }, 500);
  }
};

// ===========================
// UPDATE VEHICLE
// ===========================
export const updateVehicle = async (c: any) => {
  try {
    const vehicle_id = Number(c.req.param("id"));
    const body = await c.req.json();

    const updatedVehicle = await VehicleService.updateVehicle(vehicle_id, body);

    return c.json(
      { message: "Vehicle updated successfully", vehicle: updatedVehicle }, 
      200
    );
  } catch (error) {
    console.error("Update error:", error);
    return c.json({ message: "Internal Server Error" }, 500);
  }
};



// ===========================
// DELETE VEHICLE
// ===========================
export const deleteVehicle = async (c: Context) => {
  try {
    const vehicle_id = Number(c.req.param("vehicle_id"));
    const ok = await VehicleService.deleteVehicleService(vehicle_id);

    if (!ok) return c.json({ error: "Vehicle not found" }, 404);

    return c.json({ message: "Vehicle deleted successfully" }, 200);
  } catch (err) {
    return c.json({ error: "Failed to delete vehicle" }, 500);
  }
};

// ===========================
// SET AVAILABLE
// ===========================
export const setVehicleAvailable = async (c: Context) => {
  try {
    const vehicle_id = Number(c.req.param("vehicle_id"));
    const updated = await VehicleService.markVehicleAsAvailable(vehicle_id);

    return c.json({ message: "Vehicle is now available", vehicle: updated });
  } catch (err) {
    return c.json({ error: "Failed to update availability" }, 500);
  }
};

// ===========================
// SET UNAVAILABLE
// ===========================
export const setVehicleUnavailable = async (c: Context) => {
  try {
    const vehicle_id = Number(c.req.param("vehicle_id"));
    const updated = await VehicleService.markVehicleAsUnavailable(vehicle_id);

    return c.json({ message: "Vehicle is now unavailable", vehicle: updated });
  } catch (err) {
    return c.json({ error: "Failed to update availability" }, 500);
  }
};

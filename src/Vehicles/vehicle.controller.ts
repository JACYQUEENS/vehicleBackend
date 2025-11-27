import { type Context } from "hono";
import * as VehicleServices from './vehicle.service.ts'
// GET ALL VEHICLES

export const getAllVehicles = async (c: Context) => {
    try {
        const result = await VehicleServices.getAllVehicles();

        if (result.length === 0) {
            return c.json({ message: "No vehicles found" }, 404);
        }

        return c.json(result);

    } catch (error: any) {
        console.log("Error fetching vehicles:", error.message);
        return c.json({ error: "Failed to fetch vehicles" }, 500);
    }
};

//  GET VEHICLE BY ID
export const getVehicleById = async (c: Context) => {
    const vehicle_id = parseInt(c.req.param("vehicle_id"));

    try {
        const result = await VehicleServices.getVehicleById(vehicle_id);

        if (result === null) {
            return c.json({ error: "Vehicle not found" }, 404);
        }

        return c.json(result);

    } catch (error) {
        console.log("Error fetching vehicle:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};
// CREATE VEHICLE
export const createVehicle = async (c: Context) => {
    try {
        const body = await c.req.json() as { vehicle_spec_id:number, rental_rate: string, availability: string, image_url:string};

const message=await VehicleServices.createVehicle (body.vehicle_spec_id, body.rental_rate, body.availability, body.image_url);

   if (message==='Failed to create vehicle') {
            return c.json({ error: "failed to create a vehicle" }, 400)
        }
        return c.json({ message:'Vehicle created successfully 🚗🎉 '}, 201);

    } catch (error) {
        console.log("Error creating vehicle:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

//  UPDATE VEHICLE

export const updateVehicle = async (c: Context) => {
    try {
        const vehicle_id = parseInt(c.req.param("vehicle_id"));
        const body = await c.req.json();

        const checkExists = await VehicleServices.getVehicleById(vehicle_id);

        if (checkExists === null) {
            return c.json({ error: "Vehicle not found" }, 404);
        }

        const result = await VehicleServices.updateVehicle(
            vehicle_id,
            body.vehicle_spec_id,
            body.rental_rate,
            body.availability,
            body.image_url
        );

        return c.json({
            message: "Vehicle updated successfully",
            updated_vehicle: result
        }, 200);

    } catch (error) {
        console.log("Error updating vehicle:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};


//  DELETE VEHICLE
export const deleteVehicle = async (c: Context) => {
    const vehicle_id = parseInt(c.req.param("vehicle_id"));

    try {
        const check = await VehicleServices.getVehicleById(vehicle_id);

        if (check === null) {
            return c.json({ error: "Vehicle not found" }, 404);
        }

        const message = await VehicleServices.deleteVehicle(vehicle_id);

        return c.json({
            message: "Vehicle deleted successfully",
            deleted_vehicle: message
        }, 200);

    } catch (error) {
        console.log("Error deleting vehicle:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
};

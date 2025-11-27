import { type Context } from "hono";
import * as VehicleSpecService from "./vehiclespecification.service.ts";

//  GET ALL VEHICLE SPECIFICATIONS
export const getAllVehicleSpecs = async (c: Context) => {
    try {
        const result = await VehicleSpecService.getAllVehicleSpecs();
        if (result.length === 0) {
            return c.json({ message: "No Vehicle Specifications found" }, 404);
        }
        return c.json(result);
    } catch (error: any) {
        console.log("Error fetching Vehicle Specifications:", error.message);
        return c.json({ error: "Failed to fetch Vehicle Specifications" }, 500);
    }
};

// GET SINGLE VEHICLE SPECIFICATION BY ID
export const getVehicleSpecById = async (c: Context) => {
    const vehicleSpec_id = parseInt(c.req.param("vehicleSpec_id"));
    try {
        const result = await VehicleSpecService.getVehicleSpecById(vehicleSpec_id);
        if (!result) {
            return c.json({ error: "Vehicle Specification not found" }, 404);
        }
        return c.json(result);
    } catch (error: any) {
        console.log("Error fetching Vehicle Specification:", error.message);
        return c.json({ error: "Internal server error" }, 500);
    }
};



// CREATE VEHICLE SPECIFICATION
export const createVehicleSpec = async (c: Context) => {
    try {
        
    const body=await c.req.json() as { 
       
 manufacturer: string,
  model: string,
  year: string,
  fuel_type: string,
  engine_capacity: string,
  transmission: string,
  seating_capacity: string,
  color: string,
  features: string
};

  const message=await VehicleSpecService.createVehicleSpec(
    body.manufacturer, 
    body.model, 
    body.year, 
    body.fuel_type,
    body.engine_capacity,
    body.transmission,
    body.seating_capacity,
    body.color,
    body.features);
  if(message==='Failed to create vehicle specification'){
    return c.json({error:'Failed to create '})
  }
  return c.json({message:'Successfully created '})}

        catch (error: any) {
        console.log("Error in creating vehicle:", error.message);
        
        return c.json({ error: "Internal server error" }, 500);
    }
    }










//  UPDATE VEHICLE SPECIFICATION
export const updateVehicleSpec = async (c: Context) => {
    const vehicleSpec_id = parseInt(c.req.param("vehicleSpec_id"));
    try {
        const body = await c.req.json();

        const checkExists = await VehicleSpecService.getVehicleSpecById(vehicleSpec_id);
        if (!checkExists) {
            return c.json({ error: "Vehicle Specification not found" }, 404);
        }

        // Pass the entire payload as a single object along with the id to match the service signature
        const updatedSpec = await VehicleSpecService.updateVehicleSpec(vehicleSpec_id, body);

        return c.json({ message: "Vehicle Specification updated successfully", updatedSpec }, 200);
    } catch (error: any) {
        console.log("Error updating Vehicle Specification:", error.message);
        return c.json({ error: "Internal server error" }, 500);
    }
};

// DELETE VEHICLE SPECIFICATION
export const deleteVehicleSpec = async (c: Context) => {
    const vehicleSpec_id = parseInt(c.req.param("vehicleSpec_id"));
    try {
        const checkExists = await VehicleSpecService.getVehicleSpecById(vehicleSpec_id);
        if (!checkExists) {
            return c.json({ error: "Vehicle Specification not found" }, 404);
        }

        const message = await VehicleSpecService.deleteVehicleSpec(vehicleSpec_id);
        return c.json({ message }, 200);
    } catch (error: any) {
        console.log("Error deleting Vehicle Specification:", error.message);
        return c.json({ error: "Internal server error" }, 500);
    }
};

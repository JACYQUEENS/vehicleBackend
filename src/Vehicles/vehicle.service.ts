// import { getDbPool } from '../database/db.config.ts'

// // Interfaces
// interface VehicleSpecInfo {
//     vehicleSpec_id: number;
//     manufacturer: string;
//     model?: string;
//     year: number;
//     fuel_type: string;
//     engine_capacity?: string;
//     transmission?: string;
//     seating_capacity?: number;
//     color?: string;
//     features?: string;
// }

// export interface VehicleResponse {
//     vehicle_id: number;
//     rental_rate: string;
//     availability: string;
//     created_at?: Date;
//     updated_at?: Date;
//     image_url:string;

//     vehicleSpec: VehicleSpecInfo;
// }

// // ---------------------------------------------------------
// // ✅ GET ALL VEHICLES
// // ---------------------------------------------------------
// export const getAllVehicles = async (): Promise<VehicleResponse[]> => {
//     const db = getDbPool();

//     const query = `
//         SELECT 
//             v.vehicle_id,
//             v.vehicleSpec_id,
//             v.rental_rate,
//             v.availability,
//             v.created_at,
//             v.updated_at,
//             v.image_url,

//             s.manufacturer,
//             s.model,
//             s.year,
//             s.fuel_type,
//             s.engine_capacity,
//             s.transmission,
//             s.seating_capacity,
//             s.color,
//             s.features

//         FROM Vehicles v
//         INNER JOIN vehicleSpecification s 
//             ON v.vehicleSpec_id = s.vehicleSpec_id
//         ORDER BY v.created_at DESC
//     `;

//     const result = await db.request().query(query);

//     return result.recordset.map(row => ({
//         vehicle_id: row.vehicle_id,
//         rental_rate: row.rental_rate,
//         availability: row.availability,
//         created_at: row.created_at,
//         updated_at: row.updated_at,
//         image_url: row.image_url,

//         vehicleSpec: {
//             vehicleSpec_id: row.vehicleSpec_id,
//             manufacturer: row.manufacturer,
//             model: row.model,
//             year: row.year,
//             fuel_type: row.fuel_type,
//             engine_capacity: row.engine_capacity,
//             transmission: row.transmission,
//             seating_capacity: row.seating_capacity,
//             color: row.color,
//             features: row.features
//         }
//     }));
// };


// // GET VEHICLE BY ID
// export const getVehicleById = async (vehicle_id: number): Promise<VehicleResponse | null> => {
//     const db = getDbPool();

//     const query = `
//         SELECT 
//             v.vehicle_id,
//             v.vehicleSpec_id,
//             v.rental_rate,
//             v.availability,
//             v.created_at,
//             v.updated_at,
//             v.image_url,

//             s.manufacturer,
//             s.model,
//             s.year,
//             s.fuel_type,
//             s.engine_capacity,
//             s.transmission,
//             s.seating_capacity,
//             s.color,
//             s.features

//         FROM Vehicles v
//         INNER JOIN vehicleSpecification s 
//             ON v.vehicleSpec_id = s.vehicleSpec_id
//         WHERE v.vehicle_id = @vehicle_id
//     `;

//     const result = await db.request()
//         .input("vehicle_id", vehicle_id)
//         .query(query);

//     if (!result.recordset.length) return null;

//     const row = result.recordset[0];

//     return {
//         vehicle_id: row.vehicle_id,
//         rental_rate: row.rental_rate,
//         availability: row.availability,
//         created_at: row.created_at,
//         updated_at: row.updated_at,
//          image_url: row.image_url,

//         vehicleSpec: {
//             vehicleSpec_id: row.vehicleSpec_id,
//             manufacturer: row.manufacturer,
//             model: row.model,
//             year: row.year,
//             fuel_type: row.fuel_type,
//             engine_capacity: row.engine_capacity,
//             transmission: row.transmission,
//             seating_capacity: row.seating_capacity,
//             color: row.color,
//             features: row.features
//         }
//     };
// };

// //  CREATE VEHICLE
// export const createVehicle = async (
//     vehicleSpec_id: number,
//     rental_rate: string,
//     availability: string,
//      image_url: string
// ): Promise<string> => {
//     const db = getDbPool();

//     const query = `
//         INSERT INTO Vehicles (vehicleSpec_id, rental_rate, availability, image_url)
//         VALUES (@vehicleSpec_id, @rental_rate, @availability, @image_url)
//     `;

//     const result = await db.request()
//         .input("vehicleSpec_id", vehicleSpec_id)
//         .input("rental_rate", rental_rate)
//         .input("availability", availability)
//         .input("image_url", image_url)
//         .query(query);

//     return result.rowsAffected[0] === 1
//         ? "Vehicle created successfully 🚗🎉"
//         : "Failed to create vehicle";
// };


// //  UPDATE VEHICLE
// export const updateVehicle = async (
//     vehicle_id: number,
//     vehicleSpec_id: number,
//     rental_rate: string,
//     availability: string,
//     image_url: string
// ): Promise<VehicleResponse | null> => {
//     const db = getDbPool();

//     const query = `
//         UPDATE Vehicles
//         SET vehicleSpec_id=@vehicleSpec_id,
//             rental_rate=@rental_rate,
//             availability=@availability,
//             image_url=@image_url,
//             updated_at=GETDATE()
//         WHERE vehicle_id=@vehicle_id
//     `;

//     await db.request()
//         .input("vehicle_id", vehicle_id)
//         .input("vehicleSpec_id", vehicleSpec_id)
//         .input("rental_rate", rental_rate)
//         .input("availability", availability)
//         .input("image_url", image_url)
//         .query(query);

//     return await getVehicleById(vehicle_id);
// };

// // ---------------------------------------------------------
// // ✅ DELETE VEHICLE
// // ---------------------------------------------------------
// export const deleteVehicle = async (vehicle_id: number): Promise<string> => {
//     const db = getDbPool();

//     const query = "DELETE FROM Vehicles WHERE vehicle_id=@vehicle_id";

//     const result = await db.request()
//         .input("vehicle_id", vehicle_id)
//         .query(query);

//     return result.rowsAffected[0] === 1
//         ? "Vehicle deleted successfully 🗑️"
//         : "Failed to delete vehicle";
// };

// src/services/vehicles.service.ts
import { getDbPool } from "../database/db.config.ts";

// ===========================
// CREATE VEHICLE
// ===========================
export const createVehicleService = async (data: any) => {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("vehicleSpec_id", data.vehicleSpec_id)
    .input("rental_rate", data.rental_rate)
    .input("availability", data.availability)
    .input("image_url", data.image_url)
    .query(`
      INSERT INTO Vehicles (vehicleSpec_id, rental_rate, availability, image_url)
      OUTPUT INSERTED.*
      VALUES (@vehicleSpec_id, @rental_rate, @availability, @image_url)
    `);

  return result.recordset[0];
};

// ===========================
// GET ALL VEHICLES
// ===========================
export const getAllVehiclesService = async () => {
  const pool = await getDbPool();
  const result = await pool.request().query("SELECT * FROM Vehicles");
  return result.recordset;
};

// ===========================
// GET VEHICLE BY ID
// ===========================
export const getVehicleByIdService = async (vehicle_id: number) => {
  const pool = await getDbPool();
  const result = await pool
    .request()
    .input("vehicle_id", vehicle_id)
    .query("SELECT * FROM Vehicles WHERE vehicle_id = @vehicle_id");

  return result.recordset[0];
};

// ===========================
// UPDATE VEHICLE
// ===========================
export const updateVehicle = async (
  vehicle_id: number,
  payload: {
    vehicleSpec_id: number;
    availability: string;
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    transmission: string;
    seating_capacity: number;
    color: string;
  }
) => {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("vehicle_id", vehicle_id)
    .input("vehicleSpec_id", payload.vehicleSpec_id)
    .input("availability", payload.availability)
    .input("manufacturer", payload.manufacturer)
    .input("model", payload.model)
    .input("year", payload.year)
    .input("fuel_type", payload.fuel_type)
    .input("transmission", payload.transmission)
    .input("seating_capacity", payload.seating_capacity)
    .input("color", payload.color)
    .query(`
      -- Update vehicles table
      UPDATE v
      SET 
        v.vehicleSpec_id = @vehicleSpec_id,
        v.availability = @availability
      FROM vehicles v
      WHERE v.vehicle_id = @vehicle_id;

      -- Update specification table
      UPDATE vs
      SET
        vs.manufacturer = @manufacturer,
        vs.model = @model,
        vs.year = @year,
        vs.fuel_type = @fuel_type,
        vs.transmission = @transmission,
        vs.seating_capacity = @seating_capacity,
        vs.color = @color
      FROM vehicleSpecification vs
      INNER JOIN vehicles v 
        ON v.vehicleSpec_id = vs.vehicleSpec_id
      WHERE v.vehicle_id = @vehicle_id;

      -- Return updated record
      SELECT 
        v.*, 
        vs.*
      FROM vehicles v
      INNER JOIN vehicleSpecification vs 
        ON v.vehicleSpec_id = vs.vehicleSpec_id
      WHERE v.vehicle_id = @vehicle_id;
    `);

  return result.recordset[0];
};

// ===========================
// DELETE VEHICLE
// ===========================
export const deleteVehicleService = async (vehicle_id: number) => {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("vehicle_id", vehicle_id)
    .query("DELETE FROM Vehicles WHERE vehicle_id = @vehicle_id");

  return result.rowsAffected[0] > 0;
};

// ===========================
// SET TO AVAILABLE
// ===========================
export const markVehicleAsAvailable = async (vehicle_id: number) => {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("vehicle_id", vehicle_id)
    .query(`
      UPDATE Vehicles 
      SET availability = 'true', updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE vehicle_id = @vehicle_id
    `);

  return result.recordset[0];
};

// ===========================
// SET TO UNAVAILABLE
// ===========================
export const markVehicleAsUnavailable = async (vehicle_id: number) => {
  const pool = await getDbPool();

  const result = await pool
    .request()
    .input("vehicle_id", vehicle_id)
    .query(`
      UPDATE Vehicles 
      SET availability = 'false', updated_at = GETDATE()
      OUTPUT INSERTED.*
      WHERE vehicle_id = @vehicle_id
    `);

  return result.recordset[0];
};

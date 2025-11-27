import { getDbPool } from '../database/db.config.ts'

// Interfaces
interface VehicleSpecInfo {
    vehicleSpec_id: number;
    manufacturer: string;
    model?: string;
    year: number;
    fuel_type: string;
    engine_capacity?: string;
    transmission?: string;
    seating_capacity?: number;
    color?: string;
    features?: string;
}

export interface VehicleResponse {
    vehicle_id: number;
    rental_rate: string;
    availability: string;
    created_at?: Date;
    updated_at?: Date;
    image_url:string;

    vehicleSpec: VehicleSpecInfo;
}

// ---------------------------------------------------------
// ✅ GET ALL VEHICLES
// ---------------------------------------------------------
export const getAllVehicles = async (): Promise<VehicleResponse[]> => {
    const db = getDbPool();

    const query = `
        SELECT 
            v.vehicle_id,
            v.vehicle_spec_id,
            v.rental_rate,
            v.availability,
            v.created_at,
            v.updated_at,
            v.image_url,

            s.manufacturer,
            s.model,
            s.year,
            s.fuel_type,
            s.engine_capacity,
            s.transmission,
            s.seating_capacity,
            s.color,
            s.features

        FROM Vehicles v
        INNER JOIN vehicleSpecification s 
            ON v.vehicle_spec_id = s.vehicleSpec_id
        ORDER BY v.created_at DESC
    `;

    const result = await db.request().query(query);

    return result.recordset.map(row => ({
        vehicle_id: row.vehicle_id,
        rental_rate: row.rental_rate,
        availability: row.availability,
        created_at: row.created_at,
        updated_at: row.updated_at,
        image_url: row.image_url,

        vehicleSpec: {
            vehicleSpec_id: row.vehicle_spec_id,
            manufacturer: row.manufacturer,
            model: row.model,
            year: row.year,
            fuel_type: row.fuel_type,
            engine_capacity: row.engine_capacity,
            transmission: row.transmission,
            seating_capacity: row.seating_capacity,
            color: row.color,
            features: row.features
        }
    }));
};


// GET VEHICLE BY ID
export const getVehicleById = async (vehicle_id: number): Promise<VehicleResponse | null> => {
    const db = getDbPool();

    const query = `
        SELECT 
            v.vehicle_id,
            v.vehicle_spec_id,
            v.rental_rate,
            v.availability,
            v.created_at,
            v.updated_at,
            v.image_url,

            s.manufacturer,
            s.model,
            s.year,
            s.fuel_type,
            s.engine_capacity,
            s.transmission,
            s.seating_capacity,
            s.color,
            s.features

        FROM Vehicles v
        INNER JOIN vehicleSpecification s 
            ON v.vehicle_spec_id = s.vehicleSpec_id
        WHERE v.vehicle_id = @vehicle_id
    `;

    const result = await db.request()
        .input("vehicle_id", vehicle_id)
        .query(query);

    if (!result.recordset.length) return null;

    const row = result.recordset[0];

    return {
        vehicle_id: row.vehicle_id,
        rental_rate: row.rental_rate,
        availability: row.availability,
        created_at: row.created_at,
        updated_at: row.updated_at,
         image_url: row.image_url,

        vehicleSpec: {
            vehicleSpec_id: row.vehicle_spec_id,
            manufacturer: row.manufacturer,
            model: row.model,
            year: row.year,
            fuel_type: row.fuel_type,
            engine_capacity: row.engine_capacity,
            transmission: row.transmission,
            seating_capacity: row.seating_capacity,
            color: row.color,
            features: row.features
        }
    };
};

//  CREATE VEHICLE
export const createVehicle = async (
    vehicle_spec_id: number,
    rental_rate: string,
    availability: string,
     image_url: string
): Promise<string> => {
    const db = getDbPool();

    const query = `
        INSERT INTO Vehicles (vehicle_spec_id, rental_rate, availability, image_url)
        VALUES (@vehicle_spec_id, @rental_rate, @availability, @image_url)
    `;

    const result = await db.request()
        .input("vehicle_spec_id", vehicle_spec_id)
        .input("rental_rate", rental_rate)
        .input("availability", availability)
        .input("image_url", image_url)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Vehicle created successfully 🚗🎉"
        : "Failed to create vehicle";
};


//  UPDATE VEHICLE
export const updateVehicle = async (
    vehicle_id: number,
    vehicle_spec_id: number,
    rental_rate: string,
    availability: string,
    image_url: string
): Promise<VehicleResponse | null> => {
    const db = getDbPool();

    const query = `
        UPDATE Vehicles
        SET vehicle_spec_id=@vehicle_spec_id,
            rental_rate=@rental_rate,
            availability=@availability,
            image_url=@image_url,
            updated_at=GETDATE()
        WHERE vehicle_id=@vehicle_id
    `;

    await db.request()
        .input("vehicle_id", vehicle_id)
        .input("vehicle_spec_id", vehicle_spec_id)
        .input("rental_rate", rental_rate)
        .input("availability", availability)
        .input("image_url", image_url)
        .query(query);

    return await getVehicleById(vehicle_id);
};

// ---------------------------------------------------------
// ✅ DELETE VEHICLE
// ---------------------------------------------------------
export const deleteVehicle = async (vehicle_id: number): Promise<string> => {
    const db = getDbPool();

    const query = "DELETE FROM Vehicles WHERE vehicle_id=@vehicle_id";

    const result = await db.request()
        .input("vehicle_id", vehicle_id)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Vehicle deleted successfully 🗑️"
        : "Failed to delete vehicle";
};

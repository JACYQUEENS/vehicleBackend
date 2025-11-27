import { getDbPool } from "../database/db.config.ts";

// Interface for vehicleSpecification
export interface VehicleSpecificationInfo {
  vehicleSpec_id: number;
  manufacturer: string;
  model: string;
  year: string;
  fuel_type: string;
  engine_capacity: string;
  transmission: string;
  seating_capacity: string;
  color: string;
  features: string;
}

// GET ALL Vehicle Specifications
export const getAllVehicleSpecs = async (): Promise<VehicleSpecificationInfo[]> => {
  const db = getDbPool();
  const query = `SELECT * FROM vehicleSpecification`;
  const result = await db.request().query(query);
  return result.recordset;
};

// GET Single Vehicle Specification by ID
export const getVehicleSpecById = async (vehicleSpec_id: number): Promise<VehicleSpecificationInfo | null> => {
  const db = getDbPool();
  const query = `SELECT * FROM vehicleSpecification WHERE vehicleSpec_id=@vehicleSpec_id`;
  const result = await db.request()
    .input("vehicleSpec_id", vehicleSpec_id)
    .query(query);

  return result.recordset[0] || null;
};



// CREATE Vehicle Specification
export const createVehicleSpec = async (manufacturer: string,model: string,year: string,fuel_type: string,engine_capacity: string,transmission: string,seating_capacity: string,color: string,features: string,
): Promise<string> => {
  const db = getDbPool();
  const query = `
    INSERT INTO vehicleSpecification 
      (manufacturer, model, year, fuel_type, engine_capacity, transmission, seating_capacity, color, features)
    VALUES 
      (@manufacturer, @model, @year, @fuel_type, @engine_capacity, @transmission, @seating_capacity, @color, @features)
  `;

  const result = await db.request()
    .input("manufacturer", manufacturer)
    .input("model", model )
    .input("year", year)
    .input("fuel_type", fuel_type)
    .input("engine_capacity", engine_capacity )
    .input("transmission", transmission )
    .input("seating_capacity", seating_capacity )
    .input("color", color )
    .input("features", features )
    .query(query);

  return result.rowsAffected[0] === 1
    ? "Vehicle specification created successfully 🎉"
    : "Failed to create vehicle specification";
};

// UPDATE Vehicle Specification
export const updateVehicleSpec = async (vehicleSpec_id: number, vehicle: VehicleSpecificationInfo): Promise<VehicleSpecificationInfo | null> => {
  const db = getDbPool();
  const query = `
    UPDATE vehicleSpecification
    SET manufacturer=@manufacturer,
        model=@model,
        year=@year,
        fuel_type=@fuel_type,
        engine_capacity=@engine_capacity,
        transmission=@transmission,
        seating_capacity=@seating_capacity,
        color=@color,
        features=@features
    WHERE vehicleSpec_id=@vehicleSpec_id
  `;

  await db.request()
    .input("vehicleSpec_id", vehicleSpec_id)
    .input("manufacturer", vehicle.manufacturer)
    .input("model", vehicle.model || null)
    .input("year", vehicle.year)
    .input("fuel_type", vehicle.fuel_type)
    .input("engine_capacity", vehicle.engine_capacity || null)
    .input("transmission", vehicle.transmission || null)
    .input("seating_capacity", vehicle.seating_capacity || null)
    .input("color", vehicle.color || null)
    .input("features", vehicle.features || null)
    .query(query);

  return await getVehicleSpecById(vehicleSpec_id);
};




// DELETE Vehicle Specification
export const deleteVehicleSpec = async (vehicleSpec_id: number): Promise<string> => {
  const db = getDbPool();
  const query = `DELETE FROM vehicleSpecification WHERE vehicleSpec_id=@vehicleSpec_id`;
  const result = await db.request()
    .input("vehicleSpec_id", vehicleSpec_id)
    .query(query);

  return result.rowsAffected[0] === 1
    ? "Vehicle specification deleted successfully 🎊"
    : "Failed to delete vehicle specification";
};

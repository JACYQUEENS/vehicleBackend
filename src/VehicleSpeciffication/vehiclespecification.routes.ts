import { Hono } from 'hono';
import * as VehicleSpecController from  './vehiclespeciffication.controller.ts'

const VehicleSpecRoutes = new Hono();

// CREATE VEHICLE SPECIFICATION
VehicleSpecRoutes.post('/vehicle-specs', VehicleSpecController.createVehicleSpec);

// GET ALL VEHICLE SPECIFICATIONS
VehicleSpecRoutes.get('/vehicle-specs', VehicleSpecController.getAllVehicleSpecs);

// GET VEHICLE SPECIFICATION BY ID
VehicleSpecRoutes.get('/vehicle-specs/:vehicleSpec_id', VehicleSpecController.getVehicleSpecById);

// UPDATE VEHICLE SPECIFICATION
VehicleSpecRoutes.put('/vehicle-specs/:vehicleSpec_id', VehicleSpecController.updateVehicleSpec);

// DELETE VEHICLE SPECIFICATION
VehicleSpecRoutes.delete('/vehicle-specs/:vehicleSpec_id', VehicleSpecController.deleteVehicleSpec);

export default VehicleSpecRoutes;

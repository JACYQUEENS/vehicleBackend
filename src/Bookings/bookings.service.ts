// src/features/bookings/bookings.service.ts
import { getDbPool } from "../database/db.config.ts";

export interface BookingData {
  booking_id?: number;
  user_id: number;
  vehicle_id: number;
  booking_date: string | Date;
  return_date: string | Date;
  total_amount: number;
  booking_status?: string;
}

// CREATE BOOKING (marks vehicle Available)
export const createBookingService = async (data: BookingData) => {
  const db = getDbPool();

  // Mark vehicle as Available
  await db.request()
    .input("vehicle_id", data.vehicle_id)
    .query(`UPDATE Vehicles SET availability='Available', updated_at=GETDATE() WHERE vehicle_id=@vehicle_id`);

  // Insert booking
  const query = `
    INSERT INTO Bookings (
      user_id,
      vehicle_id,
      booking_date,
      return_date,
      total_amount,
      booking_status,
      created_at
    )
    OUTPUT INSERTED.*
    VALUES (
      @user_id,
      @vehicle_id,
      @booking_date,
      @return_date,
      @total_amount,
      @booking_status,
      GETDATE()
    )
  `;
  const result = await db.request()
    .input("user_id", data.user_id)
    .input("vehicle_id", data.vehicle_id)
    .input("booking_date", new Date(data.booking_date))
    .input("return_date", new Date(data.return_date))
    .input("total_amount", data.total_amount)
    .input("booking_status", data.booking_status ?? "pending")
    .query(query);

  return result.recordset[0];
};

// ===========================
// GET ALL BOOKINGS - SIMPLE VERSION
// ===========================
export const getAllBookingsService = async () => {
  try {
    console.log("📊 [SERVICE] Getting all bookings (simple)...");
    
    const db = getDbPool();
    
    // SIMPLE QUERY - No joins
    const query = "SELECT * FROM Bookings ORDER BY created_at DESC";
    
    const result = await db.request().query(query);
    
    console.log(`✅ [SERVICE] Found ${result.recordset.length} bookings`);
    
    if (result.recordset.length > 0) {
      console.log("📝 [SERVICE] First booking:", {
        id: result.recordset[0].booking_id,
        user_id: result.recordset[0].user_id,
        vehicle_id: result.recordset[0].vehicle_id
      });
    }
    
    return result.recordset;
    
  } catch (error: any) {
    console.error("❌ [SERVICE] Error in getAllBookingsService:", error.message);
    throw error;
  }
};
// GET BOOKINGS BY USER ID
export const getBookingsByUserIdService = async (user_id: number) => {
  const db = getDbPool();
  const query = `
    SELECT 
      b.*,
      v.vehicle_id AS v_vehicle_id,
      v.vehicleSpec_id AS v_vehicleSpec_id,
      v.rental_rate AS v_rental_rate,
      v.availability AS v_availability,
      v.image_url AS v_image_url,
      s.manufacturer,
      s.model,
      s.year
    FROM Bookings b
    LEFT JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
    LEFT JOIN vehicleSpecification s ON v.vehicleSpec_id = s.vehicleSpec_id
    WHERE b.user_id=@user_id
    ORDER BY b.created_at DESC
  `;
  const result = await db.request().input("user_id", user_id).query(query);
  return result.recordset;
};

// GET BOOKING BY ID
export const getBookingByIdService = async (booking_id: number) => {
  const db = getDbPool();
  const query = `
    SELECT 
      b.*,
      v.vehicle_id AS v_vehicle_id,
      v.vehicleSpec_id AS v_vehicleSpec_id,
      v.rental_rate AS v_rental_rate,
      v.availability AS v_availability,
      v.image_url AS v_image_url,
      s.manufacturer,
      s.model,
      s.year
    FROM Bookings b
    LEFT JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
    LEFT JOIN vehicleSpecification s ON v.vehicleSpec_id = s.vehicleSpec_id
    WHERE b.booking_id=@booking_id
  `;
  const result = await db.request().input("booking_id", booking_id).query(query);
  return result.recordset[0];
};

// UPDATE BOOKING
export const updateBookingService = async (booking_id: number, data: BookingData) => {
  const db = getDbPool();
  const query = `
    UPDATE Bookings
    SET 
      user_id=@user_id,
      vehicle_id=@vehicle_id,
      booking_date=@booking_date,
      return_date=@return_date,
      total_amount=@total_amount,
      booking_status=@booking_status,
      updated_at=GETDATE()
    OUTPUT INSERTED.*
    WHERE booking_id=@booking_id
  `;
  const result = await db.request()
    .input("booking_id", booking_id)
    .input("user_id", data.user_id)
    .input("vehicle_id", data.vehicle_id)
    .input("booking_date", new Date(data.booking_date))
    .input("return_date", new Date(data.return_date))
    .input("total_amount", data.total_amount)
    .input("booking_status", data.booking_status ?? "pending")
    .query(query);
  return result.recordset[0];
};

// DELETE BOOKING
export const deleteBookingService = async (booking_id: number) => {
  const db = getDbPool();

  // Get vehicle_id before deleting
  const booking = await db.request()
    .input("booking_id", booking_id)
    .query(`SELECT vehicle_id FROM Bookings WHERE booking_id=@booking_id`);

  if (!booking.recordset.length) return false;
  const vehicle_id = booking.recordset[0].vehicle_id;

  // Delete booking
  const deleteResult = await db.request()
    .input("booking_id", booking_id)
    .query(`DELETE FROM Bookings WHERE booking_id=@booking_id`);

  // Mark vehicle available
  await db.request()
    .input("vehicle_id", vehicle_id)
    .query(`UPDATE Vehicles SET availability='Available', updated_at=GETDATE() WHERE vehicle_id=@vehicle_id`);

  return deleteResult.rowsAffected[0] === 1;
};

// APPROVE, COMPLETE, CANCEL (same logic as before)
export const approveBookingService = async (booking_id: number) => {
  const db = getDbPool();
  const result = await db.request()
    .input("booking_id", booking_id)
    .query(`
      UPDATE Bookings
      SET booking_status='approved', updated_at=GETDATE()
      OUTPUT INSERTED.*
      WHERE booking_id=@booking_id
    `);
  return result.recordset[0];
};

export const completeBookingService = async (booking_id: number, vehicle_id: number) => {
  const db = getDbPool();
  const result = await db.request()
    .input("booking_id", booking_id)
    .query(`
      UPDATE Bookings
      SET booking_status='returned', updated_at=GETDATE()
      OUTPUT INSERTED.*
      WHERE booking_id=@booking_id
    `);
  await db.request()
    .input("vehicle_id", vehicle_id)
    .query(`UPDATE Vehicles SET availability='Available', updated_at=GETDATE() WHERE vehicle_id=@vehicle_id`);
  return result.recordset[0];
};

export const cancelBookingService = async (booking_id: number) => {
  const db = getDbPool();

  const booking = await db.request()
    .input("booking_id", booking_id)
    .query(`SELECT vehicle_id FROM Bookings WHERE booking_id=@booking_id`);

  if (!booking.recordset.length) return null;
  const vehicle_id = booking.recordset[0].vehicle_id;

  const result = await db.request()
    .input("booking_id", booking_id)
    .query(`
      UPDATE Bookings
      SET booking_status='cancelled', updated_at=GETDATE()
      OUTPUT INSERTED.*
      WHERE booking_id=@booking_id
    `);

  await db.request()
    .input("vehicle_id", vehicle_id)
    .query(`UPDATE Vehicles SET availability='Available', updated_at=GETDATE() WHERE vehicle_id=@vehicle_id`);

  return result.recordset[0];
};

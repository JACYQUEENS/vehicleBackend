// src/features/profile/profile.service.ts
import { getDbPool } from "../database/db.config.ts";

export interface ProfileData {
  user_id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  contact_phone?: string;
  address?: string;
  profile_picture?: string;
  role?: string;
}

// GET USER PROFILE WITH STATS
export const getProfileService = async (user_id: number) => {
  const db = getDbPool();
  
  const query = `
    SELECT 
      u.user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.contact_phone as phone_number,
      u.address,
      u.role,
      u.created_at as member_since,
      -- Add profile_picture column if exists, otherwise null
      NULL as profile_picture,
      -- Booking statistics
      (SELECT COUNT(*) FROM Bookings WHERE user_id = u.user_id) as total_bookings,
      (SELECT COUNT(*) FROM Bookings WHERE user_id = u.user_id AND booking_status = 'approved') as active_bookings,
      (SELECT COUNT(*) FROM Bookings WHERE user_id = u.user_id AND booking_status = 'returned') as completed_bookings,
      -- Favorite vehicle
      (SELECT TOP 1 CONCAT(s.manufacturer, ' ', s.model) 
       FROM Bookings b
       JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
       JOIN vehicleSpecification s ON v.vehicleSpec_id = s.vehicleSpec_id
       WHERE b.user_id = u.user_id
       GROUP BY s.manufacturer, s.model
       ORDER BY COUNT(*) DESC) as favorite_vehicle
    FROM Users u
    WHERE u.user_id = @user_id
  `;
  
  const result = await db.request()
    .input("user_id", user_id)
    .query(query);
  
  return result.recordset[0];
};

// UPDATE PROFILE
export const updateProfileService = async (user_id: number, data: ProfileData) => {
  const db = getDbPool();
  
  // Fields that exist in your Users table
  const allowedFields = ['first_name', 'last_name', 'contact_phone', 'address', 'email'];
  const updates = [];
  const inputs: any = { user_id };
  
  // Build dynamic update query
  for (const field of allowedFields) {
    if (data[field as keyof ProfileData] !== undefined) {
      updates.push(`${field} = @${field}`);
      inputs[field] = data[field as keyof ProfileData];
    }
  }
  
  if (updates.length === 0) {
    throw new Error('No valid fields to update');
  }
  
  const query = `
    UPDATE Users
    SET ${updates.join(', ')}, updated_at = GETDATE()
    WHERE user_id = @user_id
    OUTPUT INSERTED.*
  `;
  
  const request = db.request();
  for (const [key, value] of Object.entries(inputs)) {
    request.input(key, value);
  }
  
  const result = await request.query(query);
  return result.recordset[0];
};

// ADD PROFILE PICTURE COLUMN (if you want to add it later)
export const addProfilePictureColumn = async () => {
  const db = getDbPool();
  
  const checkQuery = `
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'profile_picture')
    BEGIN
        ALTER TABLE Users 
        ADD profile_picture NVARCHAR(500) NULL;
        PRINT 'Added profile_picture column to Users table';
    END
  `;
  
  await db.request().query(checkQuery);
  return { message: 'Profile picture column check completed' };
};

// UPLOAD PROFILE PICTURE (if you add the column)
export const uploadProfilePictureService = async (user_id: number, imageUrl: string) => {
  const db = getDbPool();
  
  // First check if column exists
  await addProfilePictureColumn();
  
  const query = `
    UPDATE Users
    SET profile_picture = @imageUrl, updated_at = GETDATE()
    WHERE user_id = @user_id
    OUTPUT INSERTED.*
  `;
  
  const result = await db.request()
    .input("user_id", user_id)
    .input("imageUrl", imageUrl)
    .query(query);
  
  return result.recordset[0];
};

// CHANGE PASSWORD
export const changePasswordService = async (
  user_id: number, 
  currentPassword: string, 
  newPassword: string
) => {
  const db = getDbPool();
  
  // First verify current password
  const verifyQuery = `SELECT user_id FROM Users WHERE user_id = @user_id AND password = @currentPassword`;
  const verifyResult = await db.request()
    .input("user_id", user_id)
    .input("currentPassword", currentPassword)
    .query(verifyQuery);
  
  if (!verifyResult.recordset.length) {
    throw new Error('Current password is incorrect');
  }
  
  // Update password
  const updateQuery = `
    UPDATE Users
    SET password = @newPassword, updated_at = GETDATE()
    WHERE user_id = @user_id
  `;
  
  await db.request()
    .input("user_id", user_id)
    .input("newPassword", newPassword)
    .query(updateQuery);
  
  return { message: 'Password updated successfully' };
};

// GET USER ACTIVITY (recent bookings)
export const getUserActivityService = async (user_id: number) => {
  const db = getDbPool();
  
  const query = `
    SELECT TOP 5
      b.booking_id,
      b.booking_date,
      b.return_date,
      b.total_amount,
      b.booking_status,
      CONCAT(s.manufacturer, ' ', s.model) as vehicle_name,
      v.image_url as vehicle_image
    FROM Bookings b
    JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
    JOIN vehicleSpecification s ON v.vehicleSpec_id = s.vehicleSpec_id
    WHERE b.user_id = @user_id
    ORDER BY b.created_at DESC
  `;
  
  const result = await db.request()
    .input("user_id", user_id)
    .query(query);
  
  return result.recordset;
};

// GET FULL NAME (combine first_name and last_name)
export const getFullNameService = async (user_id: number) => {
  const db = getDbPool();
  
  const query = `
    SELECT CONCAT(first_name, ' ', last_name) as full_name
    FROM Users
    WHERE user_id = @user_id
  `;
  
  const result = await db.request()
    .input("user_id", user_id)
    .query(query);
  
  return result.recordset[0]?.full_name || '';
};
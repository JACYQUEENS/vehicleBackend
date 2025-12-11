// src/features/profile/profile.controller.ts
import type { Context } from "hono";
import * as ProfileService from "./profile.service.ts";

// GET USER PROFILE
export const getProfile = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    console.log(`📞 [PROFILE] GET /profile/${user_id} called`);
    
    const profile = await ProfileService.getProfileService(user_id);
    
    if (!profile) {
      return c.json({ error: "User profile not found" }, 404);
    }
    
    // Add full name to response
    const full_name = await ProfileService.getFullNameService(user_id);
    const profileWithFullName = {
      ...profile,
      full_name
    };
    
    console.log(`✅ [PROFILE] Profile found for user ${user_id}`);
    return c.json(profileWithFullName, 200);
    
  } catch (err: any) {
    console.error("❌ [PROFILE] Error:", err);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
};

// UPDATE PROFILE
export const updateProfile = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    console.log(`📞 [PROFILE] PUT /profile/${user_id} called`);
    
    const body = await c.req.json();
    
    if (!body || Object.keys(body).length === 0) {
      return c.json({ error: "No data provided for update" }, 400);
    }
    
    // Validate allowed fields for your schema
    const allowedFields = ['first_name', 'last_name', 'contact_phone', 'address', 'email'];
    const invalidFields = Object.keys(body).filter(field => !allowedFields.includes(field));
    
    if (invalidFields.length > 0) {
      return c.json({ 
        error: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}` 
      }, 400);
    }
    
    const updated = await ProfileService.updateProfileService(user_id, body);
    
    console.log(`✅ [PROFILE] Profile updated for user ${user_id}`);
    
    return c.json({
      message: "Profile updated successfully",
      profile: updated
    }, 200);
    
  } catch (err: any) {
    console.error("❌ [PROFILE] Update error:", err);
    return c.json({ 
      error: err.message || "Failed to update profile" 
    }, 500);
  }
};

// ADD PROFILE PICTURE COLUMN (optional endpoint)
export const setupProfilePicture = async (c: Context) => {
  try {
    const result = await ProfileService.addProfilePictureColumn();
    return c.json(result, 200);
  } catch (err: any) {
    console.error("❌ [PROFILE] Setup error:", err);
    return c.json({ error: "Failed to setup profile picture" }, 500);
  }
};

// UPLOAD PROFILE PICTURE (if you add the column)
export const uploadProfilePicture = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    console.log(`📞 [PROFILE] POST /profile/${user_id}/picture called`);
    
    const body = await c.req.json();
    
    if (!body.imageUrl) {
      return c.json({ error: "Image URL required" }, 400);
    }
    
    const updated = await ProfileService.uploadProfilePictureService(user_id, body.imageUrl);
    
    console.log(`✅ [PROFILE] Picture uploaded for user ${user_id}`);
    
    return c.json({
      message: "Profile picture updated successfully",
      profile_picture: updated.profile_picture
    }, 200);
    
  } catch (err: any) {
    console.error("❌ [PROFILE] Upload error:", err);
    return c.json({ 
      error: err.message || "Failed to upload profile picture" 
    }, 500);
  }
};

// CHANGE PASSWORD
export const changePassword = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    console.log(`📞 [PROFILE] POST /profile/${user_id}/password called`);
    
    const body = await c.req.json();
    
    if (!body.currentPassword || !body.newPassword) {
      return c.json({ 
        error: "Both current and new password are required" 
      }, 400);
    }
    
    if (body.currentPassword === body.newPassword) {
      return c.json({ 
        error: "New password must be different from current password" 
      }, 400);
    }
    
    const result = await ProfileService.changePasswordService(
      user_id, 
      body.currentPassword, 
      body.newPassword
    );
    
    console.log(`✅ [PROFILE] Password changed for user ${user_id}`);
    
    return c.json(result, 200);
    
  } catch (err: any) {
    console.error("❌ [PROFILE] Password error:", err);
    return c.json({ 
      error: err.message || "Failed to change password" 
    }, 400);
  }
};

// GET USER ACTIVITY
export const getUserActivity = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    console.log(`📞 [PROFILE] GET /profile/${user_id}/activity called`);
    
    const activity = await ProfileService.getUserActivityService(user_id);
    
    return c.json({
      user_id,
      activity,
      total_activities: activity.length
    }, 200);
    
  } catch (err: any) {
    console.error("❌ [PROFILE] Activity error:", err);
    return c.json({ error: "Failed to fetch user activity" }, 500);
  }
};

// GET COMPLETE PROFILE DATA
export const getCompleteProfile = async (c: Context) => {
  try {
    const user_id = Number(c.req.param("user_id"));
    console.log(`📞 [PROFILE] GET /profile/${user_id}/complete called`);
    
    // Get profile
    const profile = await ProfileService.getProfileService(user_id);
    
    if (!profile) {
      return c.json({ error: "User not found" }, 404);
    }
    
    // Get activity
    const activity = await ProfileService.getUserActivityService(user_id);
    
    // Get full name
    const full_name = await ProfileService.getFullNameService(user_id);
    
    return c.json({
      profile: {
        ...profile,
        full_name
      },
      activity,
      summary: {
        total_bookings: profile.total_bookings || 0,
        active_bookings: profile.active_bookings || 0,
        completed_bookings: profile.completed_bookings || 0,
        favorite_vehicle: profile.favorite_vehicle || 'No favorites yet',
        role: profile.role || 'user'
      }
    }, 200);
    
  } catch (err: any) {
    console.error("❌ [PROFILE] Complete profile error:", err);
    return c.json({ error: "Failed to fetch complete profile" }, 500);
  }
};
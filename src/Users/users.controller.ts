import { type Context } from "hono";
import * as UserService from "./users.service.ts";


// GET ALL USERS

export const getAllUsers = async (c: Context) => {
  try {
    const result = await UserService.getAllUsersService();
    if (result.length === 0) {
      return c.json({ message: "No users found" }, 404);
    }
    return c.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};


// GET USER BY ID
export const getUserById = async (c: Context) => {
  const user_id = Number(c.req.param("user_id"));

  try {
    const user = await UserService.getUserByIdService(user_id);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

// UPDATE USER
export const updateUser = async (c: Context) => {
  const user_id = Number(c.req.param("user_id"));

  try {
    const existing = await UserService.getUserByIdService(user_id);
    if (!existing) {
      return c.json({ error: "User not found" }, 404);
    }

    const body = await c.req.json();

    const updated = await UserService.updateUserService(
      user_id,
      body.first_name ?? existing.first_name,
      body.last_name ?? existing.last_name,
      body.email ?? existing.email,
      body.phone_number ?? existing.phone_number,
      body.password ?? existing.password,
    );

    return c.json({
      message: "User updated successfully",
      updated_user: updated,
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

// DELETE USER
export const deleteUser = async (c: Context) => {
  const user_id = Number(c.req.param("user_id"));

  try {
    const existing = await UserService.getUserByIdService(user_id);
    if (!existing) {
      return c.json({ error: "User not found" }, 404);
    }

    const message = await UserService.deleteUserService(user_id);

    return c.json({ message });

  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

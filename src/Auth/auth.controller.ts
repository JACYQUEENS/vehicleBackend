import {  type Context } from "hono";
import { getUserByEmailService ,createUserService} from "src/Users/users.service.ts";
import * as authServices from "./Auth.service.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// types
interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  password: string;
  address: string;

}

interface LoginRequest {
  email: string;
  password: string;
}

// ✅ REGISTER USER
export const registerUser = async (c: Context) => {
  try {
    const body = await c.req.json<RegisterRequest>();
    console.log("🚀 ~ registerUser ~ body:", body)

    if (!body.first_name || !body.last_name || !body.email || !body.password || !body.contact_phone || !body.address) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Check if email exists
    const existingUser = await getUserByEmailService(body.email);
    if (existingUser) return c.json({ error: "Email already exists 😟" }, 400);

    // Hash password
    const hashedPassword = bcrypt.hashSync(body.password, 10);

    const message = await createUserService(
      body.first_name,
      body.last_name,
      body.email,
      body.contact_phone,
      body.password = hashedPassword,
      body.address,
     
    );

    return c.json({ message }, 201);
  } catch (error: any) {
    console.error("Error registering user:", error);
    return c.json({ error: error.message }, 500);
  }
};

// LOGIN USER
export const loginUser = async (c: Context) => {
  try {
    const body = await c.req.json<LoginRequest>();

    if (!body.email || !body.password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    // Find user
    const user = await getUserByEmailService(body.email);
    if (!user) return c.json({ error: "Invalid email or password 😟" }, 400);

    // Compare password
    const isPasswordValid = bcrypt.compareSync(body.password, user.password);
    if (!isPasswordValid) return c.json({ error: "Invalid email or password 😟" }, 400);

    // JWT payload
    const payload = {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "2h" });

    return c.json({ message: "Login successful 🎉", token, user: payload }, 200);
  } catch (error: any) {
    console.error("Error logging in:", error);
    return c.json({ error: error.message }, 500);
  }
};

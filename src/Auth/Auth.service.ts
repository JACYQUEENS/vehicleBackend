import { getDbPool } from "../database/db.config.ts";

//  REGISTER USER
export const registerUserService = async (
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    contact_phone: string,
    address: string
): Promise<string> => {
    const db = getDbPool();

    const query = `
        INSERT INTO Users 
        (first_name, last_name, email, password, contact_phone, address, role)
        OUTPUT INSERTED.*
        VALUES (@first_name, @last_name, @email, @password, @contact_phone, @address, 'user')
    `;

    const result = await db.request()
        .input("first_name", first_name)
        .input("last_name", last_name)
        .input("email", email)
        .input("password", password)
        .input("contact_phone", contact_phone)
        .input("address", address)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "User registered successfully 🎉"
        : "Failed to register user";
};

//  LOGIN USER
export const loginUserService = async (
    email: string,
    password: string
): Promise<any> => {
    const db = getDbPool();

    const query = `
        SELECT user_id, first_name, last_name, email, role
        FROM Users
        WHERE email = @email AND password = @password
    `;

    const result = await db.request()
        .input("email", email)
        .input("password", password)
        .query(query);

    if (result.recordset.length === 0) {
        return { 
            message: "Invalid email or password ❌", 
            success: false 
        };
    }

    const user = result.recordset[0];
    
    // Debug logging to see what's coming from database
    console.log("=== BACKEND LOGIN DEBUG ===");
    console.log("User found:", user.email);
    console.log("Database role value:", user.role);
    console.log("Role type:", typeof user.role);
    console.log("Is role exactly 'admin'?", user.role === 'admin');
    console.log("Is role exactly 'Admin'?", user.role === 'Admin');
    console.log("Role lowercase comparison:", user.role?.toString().toLowerCase() === 'admin');
    console.log("===========================");
    
    // Ensure role is properly formatted
    if (!user.role) {
        user.role = 'user'; // Default to user if role is null
    }
    
    // Convert role to lowercase for consistency
    user.role = user.role.toString().toLowerCase();

    return {
        message: "Login successful 🎉",
        success: true,
        user: user
    };
};

// Helper function to get user by ID (optional)
export const getUserByIdService = async (userId: number): Promise<any> => {
    const db = getDbPool();

    const query = `
        SELECT user_id, first_name, last_name, email, role
        FROM Users
        WHERE user_id = @userId
    `;

    const result = await db.request()
        .input("userId", userId)
        .query(query);

    if (result.recordset.length === 0) {
        return null;
    }

    return result.recordset[0];
};

// Update user role (for admin purposes)
export const updateUserRoleService = async (
    userId: number,
    newRole: string
): Promise<boolean> => {
    const db = getDbPool();

    const query = `
        UPDATE Users
        SET role = @newRole, updated_at = GETDATE()
        WHERE user_id = @userId
    `;

    const result = await db.request()
        .input("userId", userId)
        .input("newRole", newRole)
        .query(query);

    return result.rowsAffected[0] === 1;
};
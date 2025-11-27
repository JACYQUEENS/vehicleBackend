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
        (first_name, last_name, email, password, contact_phone, address)
        OUTPUT INSERTED.*
        VALUES (@first_name, @last_name, @email, @password, @contact_phone, @address)
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
        return { message: "Invalid email or password ❌", success: false };
    }

    return {
        message: "Login successful 🎉",
        success: true,
        user: result.recordset[0]
    };
};

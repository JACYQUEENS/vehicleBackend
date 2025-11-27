import { getDbPool } from '../database/db.config.ts'

// INTERFACES 

interface UserInfo {
    user_id: number;
    name: string;
    email?: string;
    phone_number?: string;
}

interface VehicleInfo {
    vehicle_id: number;
    availability: string;
    rental_rate: number;
}

interface BookingResponse {
    booking_id: number;
    booking_date: Date;
    return_date: Date;
    total_amount: number;
    booking_status: string;
    created_at?: Date;

    user: UserInfo;
    vehicle: VehicleInfo;
}

//  GET ALL BOOKINGS

export const getAllBookings = async (): Promise<BookingResponse[]> => {
    const db = getDbPool();

    const query = `
        SELECT
            b.booking_id,
            b.user_id,
            b.vehicle_id,
            b.booking_date,
            b.return_date,
            b.total_amount,
            b.booking_status,
            b.created_at,

            (u.first_name + ' ' + u.last_name) AS user_name,
            u.email AS user_email,

            v.availability AS vehicle_availability,
            v.rental_rate AS vehicle_rate

        FROM Bookings b
        INNER JOIN Users u ON b.user_id = u.user_id
        INNER JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
        ORDER BY b.created_at DESC
    `;

    const result = await db.request().query(query);

    return result.recordset.map(row => ({
        booking_id: row.booking_id,
        booking_date: row.booking_date,
        return_date: row.return_date,
        total_amount: row.total_amount,
        booking_status: row.booking_status,
        created_at: row.created_at,

        user: {
            user_id: row.user_id,
            name: row.user_name,
            email: row.user_email,
        
        },

        vehicle: {
            vehicle_id: row.vehicle_id,
            availability: row.vehicle_availability,
            rental_rate: row.vehicle_rate
        }
    }));
};

// GET BOOKING BY ID
export const getBookingById = async (
    booking_id: number
): Promise<BookingResponse | null> => {
    const db = getDbPool();

    const query = `
        SELECT
            b.booking_id,
            b.user_id,
            b.vehicle_id,
            b.booking_date,
            b.return_date,
            b.total_amount,
            b.booking_status,
            b.created_at,

            (u.first_name + ' ' + u.last_name) AS user_name,
            u.email AS user_email,
            v.availability AS vehicle_availability,
            v.rental_rate AS vehicle_rate

        FROM Bookings b
        INNER JOIN Users u ON b.user_id = u.user_id
        INNER JOIN Vehicles v ON b.vehicle_id = v.vehicle_id
        WHERE b.booking_id = @booking_id
    `;

    const result = await db.request()
        .input("booking_id", booking_id)
        .query(query);

    if (!result.recordset.length) return null;

    const row = result.recordset[0];

    return {
        booking_id: row.booking_id,
        booking_date: row.booking_date,
        return_date: row.return_date,
        total_amount: row.total_amount,
        booking_status: row.booking_status,
        created_at: row.created_at,

        user: {
            user_id: row.user_id,
            name: row.user_name,
            email: row.user_email,
        },

        vehicle: {
            vehicle_id: row.vehicle_id,
            availability: row.vehicle_availability,
            rental_rate: row.vehicle_rate
        }
    };
};


//  CREATE BOOKING

export const createBooking = async (
    user_id: number,
    vehicle_id: number,
    booking_date:string,
    return_date: string,
    total_amount: number
): Promise<string> => {
    const db = getDbPool();

    const query = `
        INSERT INTO Bookings (user_id, vehicle_id, booking_date, return_date, total_amount)
        VALUES (@user_id, @vehicle_id, @booking_date, @return_date, @total_amount)
    `;

    const result = await db.request()
        .input("user_id", user_id)
        .input("vehicle_id", vehicle_id)
        .input("booking_date", booking_date)
        .input("return_date", return_date)
        .input("total_amount", total_amount)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Booking created successfully 🎉"
        : "Failed to create booking";
};

//  UPDATE BOOKING

export const updateBooking = async (
    booking_id: number,
    user_id: number,
    vehicle_id: number,
    booking_date: string,
    return_date: string,
    total_amount: number,
    booking_status: string
): Promise<BookingResponse | null> => {
    const db = getDbPool();

    const query = `
        UPDATE Bookings
        SET user_id=@user_id,
            vehicle_id=@vehicle_id,
            booking_date=@booking_date,
            return_date=@return_date,
            total_amount=@total_amount,
            booking_status=@booking_status,
            updated_at=GETDATE()
        WHERE booking_id=@booking_id
    `;

    await db.request()
        .input("booking_id", booking_id)
        .input("user_id", user_id)
        .input("vehicle_id", vehicle_id)
        .input("booking_date", booking_date)
        .input("return_date", return_date)
        .input("total_amount", total_amount)
        .input("booking_status", booking_status)
        .query(query);

    return await getBookingById(booking_id);
};


// DELETE BOOKING
export const deleteBooking = async (booking_id: number): Promise<string> => {
    const db = getDbPool();

    const query = `DELETE FROM Bookings WHERE booking_id=@booking_id`;

    const result = await db.request()
        .input("booking_id", booking_id)
        .query(query);

    return result.rowsAffected[0] === 1
        ? "Booking deleted successfully 🎊"
        : "Failed to delete booking";
};

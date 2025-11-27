CREATE DATABASE vehicleVettingDB;


-- DROP CHILD TABLES FIRST
IF OBJECT_ID('Payments', 'U') IS NOT NULL
    DROP TABLE Payments;

IF OBJECT_ID('Bookings', 'U') IS NOT NULL
    DROP TABLE Bookings;

IF OBJECT_ID('Vehicles', 'U') IS NOT NULL
    DROP TABLE Vehicles;

IF OBJECT_ID('vehicleSpecification', 'U') IS NOT NULL
    DROP TABLE vehicleSpecification;

-- Users table can remain (no one references it)








CREATE TABLE Users(
 user_id INT IDENTITY (1,1)  PRIMARY KEY, 
 first_name NVARCHAR(25) NOT NULL,
 last_name NVARCHAR(25) NOT NULL,
 email NVARCHAR (50)  NOT NULL UNIQUE,
password NVARCHAR(25) NOT NULL,
contact_phone NVARCHAR (50) NOT NULL, 
address NVARCHAR (50) NOT NULL,
role  NVARCHAR (50) check( role IN ('user', 'admin' ))DEFAULT 'user', 
created_at DATETIME DEFAULT GETDATE(),
updated_at DATETIME DEFAULT GETDATE()
);

SELECT * FROM Users;



CREATE TABLE vehicleSpecification (
    vehicleSpec_id INT IDENTITY(1,1) PRIMARY KEY,
    manufacturer NVARCHAR(100) NOT NULL,
    model NVARCHAR(50),
    year VARCHAR(25) NOT NULL,
    fuel_type NVARCHAR(100) NOT NULL,
    engine_capacity NVARCHAR(50),
    transmission NVARCHAR(50),
    seating_capacity VARCHAR(50),
    color NVARCHAR(100),
    features NVARCHAR(100)
);


 SELECT * FROM vehicleSpecification;

CREATE TABLE Vehicles (
    vehicle_id INT IDENTITY(1,1) PRIMARY KEY,
    vehicle_spec_id INT NOT NULL,
    rental_rate NVARCHAR(50) NOT NULL,
    availability NVARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Vehicles_vehicleSpec 
        FOREIGN KEY (vehicle_spec_id)
        REFERENCES vehicleSpecification(vehicleSpec_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


 SELECT * FROM Vehicles;

CREATE TABLE Bookings (
    booking_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    booking_date DATETIME NOT NULL,
    return_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status NVARCHAR(50) NOT NULL DEFAULT 'Pending' 
        CHECK (booking_status IN ('pending','approved')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    CONSTRAINT FK_Bookings_Users 
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_Bookings_Vehicles 
        FOREIGN KEY (vehicle_id) REFERENCES Vehicles(vehicle_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT *FROM Bookings;


CREATE TABLE Payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method NVARCHAR(50) NOT NULL,
    transaction_id NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    CONSTRAINT FK_Payments_Bookings 
        FOREIGN KEY (booking_id)
        REFERENCES Bookings(booking_id)
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);


SELECT *FROM Payments;


CREATE TABLE SupportTickets (
    ticket_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    subject NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'closed')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    CONSTRAINT FK_SupportTickets_Users 
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

 SELECT * FROM SupportTickets;


 ----INSERTING VALUES
 INSERT INTO Users (first_name, last_name, email, password, contact_phone, address, role)
VALUES
('John', 'Doe', 'john@example.com', 'pass123', '0712345678', 'Nairobi', 'user'),
('Mary', 'Wanjiku', 'mary@example.com', 'pass123', '0799887766', 'Embu', 'user'),
('James', 'Kimani', 'jkimani@example.com', 'pass123', '0788899900', 'Meru', 'admin'),
('Grace', 'Achieng', 'grace@example.com', 'pass123', '0700332211', 'Kisumu', 'user'),
('Brian', 'Otieno', 'brian@example.com', 'pass123', '0722445566', 'Mombasa', 'user'),
('Alice', 'Muthoni', 'alice@example.com', 'pass123', '0733992211', 'Nakuru', 'admin'),
('Peter', 'Mwangi', 'peter@example.com', 'pass123', '0744112299', 'Thika', 'user');



INSERT INTO vehicleSpecification (manufacturer, model, year, fuel_type, engine_capacity, transmission, seating_capacity, color, features)
VALUES
('Toyota', 'Corolla', '2018', 'Petrol', '1800cc', 'Automatic', '5', 'White', 'Airbags,ABS'),
('Nissan', 'Xtrail', '2019', 'Diesel', '2200cc', 'Automatic', '7', 'Black', '4WD,Navigation'),
('Honda', 'Fit', '2017', 'Petrol', '1500cc', 'Manual', '5', 'Blue', 'Eco Mode'),
('Mazda', 'CX-5', '2020', 'Diesel', '2500cc', 'Automatic', '5', 'Red', 'Cruise Control'),
('Subaru', 'Forester', '2018', 'Petrol', '2000cc', 'Automatic', '5', 'Green', 'AWD,Sunroof'),
('Mercedes', 'C200', '2021', 'Petrol', '2000cc', 'Automatic', '5', 'Silver', 'Luxury Interior'),
('BMW', 'X3', '2020', 'Diesel', '3000cc', 'Automatic', '5', 'Black', 'Sport Mode');


INSERT INTO Vehicles (vehicle_spec_id, rental_rate, availability)
VALUES
(1, '3500', 'Available'),
(2, '5000', 'Available'),
(3, '3000', 'Unavailable'),
(4, '6000', 'Available'),
(5, '5500', 'Unavailable'),
(6, '8000', 'Available'),
(7, '9000', 'Available');



INSERT INTO Bookings (user_id, vehicle_id, booking_date, return_date, total_amount)
VALUES
(1, 1, '2024-11-01', '2024-11-03', 7000),
(2, 2, '2024-11-05', '2024-11-07', 10000),
(3, 3, '2024-11-02', '2024-11-04', 6000),
(4, 4, '2024-11-10', '2024-11-12', 12000),
(5, 5, '2024-11-06', '2024-11-08', 11000),
(6, 6, '2024-11-04', '2024-11-05', 8000),
(7, 7, '2024-11-03', '2024-11-06', 27000);


INSERT INTO Payments (booking_id, amount,  payment_method, transaction_id)
VALUES
(1, 7000,  'Mpesa', 'TXN001'),
(2, 10000,  'Card', 'TXN002'),
(3, 6000,  'Cash', 'TXN003'),
(4, 12000,  'Mpesa', 'TXN004'),
(5, 11000,  'Card', 'TXN005'),
(6, 8000,  'Mpesa', 'TXN006'),
(7, 27000,  'Mpesa', 'TXN007');

INSERT INTO SupportTickets (user_id, subject, description)
VALUES
(1, 'Payment Issue', 'I was double charged for my booking.'),
(2, 'Vehicle Condition', 'Car was not clean during pickup.'),
(3, 'Refund Request', 'I need a refund for cancelled booking.'),
(4, 'Login Issue', 'Cannot log into my account.'),
(5, 'Delayed Vehicle', 'Vehicle was delivered late.'),
(6, 'Incorrect Billing', 'Total amount charged is incorrect.'),
(7, 'App Crash', 'The website crashed during booking.');


UPDATE Users
SET role = 'user';

// import mongoose from "mongoose";
// import "dotenv/config";

// export const connect = async () => {
//   try {

//     const conn = await mongoose.connect(
//       `${process.env.MONGODB_URL}/splitappdb`
//     );

//     console.log(`DB HOST: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`MONGO DB CONNECTION ERROR: ${error}`);
//   }
// };



import mysql2 from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config();

const pool = mysql2.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    connectionLimit:10,
    queueLimit:0,
    waitForConnections:true
});

// await pool.execute(`create database todo`);

const checkConnection = async() => {
    try {
        const connection = await pool.getConnection();
        console.log("Database Connection Successfull!");
        connection.release();
    } catch (error) {
       console.log("Error connecting to database!");
        throw error;
    }
}

export {pool, checkConnection};
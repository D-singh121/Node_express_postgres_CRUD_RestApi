import pool from "../config/dbConnection.js";

const createUserTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() 
)`;

  try {
    const result = await pool.query(queryText);
    if (result) {
      console.log(" User table is ready.");
    } else {
      console.log("No changes made to User table.");
    }
  } catch (error) {
    console.log("Error creating users table : ", error);
  }
};

export default createUserTable;

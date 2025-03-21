import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/config/dbConnection.js";
import userRoutes from "./src/routes/userRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

import createUserTable from "./src/data/createUserTable.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(errorHandler); // error handler

//routes
app.use("/api/v1", userRoutes);

// creating the user table if not exists in the database
createUserTable();

// test the connection
app.get("/", async (req, res) => {
  console.log("start");
  const result = await pool.query("SELECT current_database()");
  console.log("result", result.rows);
  res.send(`Connected to the database: ${result.rows[0].current_database}`);
});

app.listen(port, () => {
  console.log(`Server is running on http:localhost:${port}`);
});

export default app;

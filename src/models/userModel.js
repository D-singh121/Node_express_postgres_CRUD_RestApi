import pool from "../config/dbConnection.js";

const getAllUsersService = async () => {
  const result = await pool.query(
    "SELECT id, name, email, created_at, updated_at FROM users"
  );
  return result.rows;
};

const getUserByIdService = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, created_at, updated_at FROM users where id = $1",
    [id]
  );
  return result.rows[0];
};

const getUserByEmailService = async (email) => {
  const result = await pool.query("SELECT * FROM users where email = $1", [
    email,
  ]);
  return result.rows[0];
};

const createUserService = async (name, email, hashedpassword) => {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedpassword]
  );
  return result.rows[0];
};

const updateUserService = async (id, name, email) => {
  // Checking if the email already exists for another user
  const emailCheck = await pool.query(
    "SELECT id FROM users WHERE email = $1 AND id != $2",
    [email, id]
  );

  if (emailCheck.rows.length > 0) {
    throw new Error("Email is already in use by another user.");
  }

  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3 RETURNING id, name, email, created_at, updated_at",
    [name, email, id]
  );

  return result.rows[0];
};

const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

export {
  createUserService,
  getUserByEmailService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};

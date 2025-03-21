import asyncHandler from "../middlewares/asyncHandler.js";
import handleResponse from "../middlewares/responseHandler.js";
import createUserService from "../models/userModel.js";

export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Input validation
  if (
    !name ||
    !email ||
    !password ||
    name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return handleResponse(res, 400, "Name, Email, and Password are required.");
  }

  // Create user in the database
  const newUser = await createUserService(name, email, password);

  // Send response
  handleResponse(res, 201, "User created successfully", newUser);
});

import asyncHandler from "../middlewares/asyncHandler.js";
import handleResponse from "../middlewares/responseHandler.js";
import {
  createUserService,
  getUserByEmailService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createUser = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      return handleResponse(
        res,
        400,
        "Name, Email, and Password are required."
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleResponse(res, 400, "Invalid email format.");
    }

    if (password.length < 6) {
      return handleResponse(
        res,
        400,
        "Password must be at least 6 characters long."
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmailService(email);
    if (existingUser) {
      return handleResponse(
        res,
        400,
        "Email is already registered Please go for Login !."
      );
    }

    // Hash password using bcryptjs
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //  Create user in the database
    const newUser = await createUserService(name, email, hashedPassword);

    // Exclude password from response for security
    const { password: _, ...userData } = newUser; // destructuring and renaming password to _
    handleResponse(res, 201, "User created successfully", userData);
  } catch (error) {
    next(error); // Pass error to your global error-handling middleware
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email.trim() === "" || password.trim() === "") {
      return handleResponse(res, 400, "Email, and Password are required.");
    }

    //Check if user is registered or not
    const user = await getUserByEmailService(email);
    if (!user) {
      return handleResponse(res, 401, "Invalid email or password.");
    }
    console.log(user);

    //  Compare password with hashed password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return handleResponse(res, 401, "Invalid email or password.");
    }

    //Generate JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "2d", // Token expires in 2 days
    });

    // Store JWT token in HTTP-only cookie
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
      });

    // //Send response (excluding password)
    // const { password: _, ...userData } = user;
    // handleResponse(res, 200, "Login successful", userData);
  } catch (error) {
    next(error); // Passing error to error-handling middleware
  }
});

const logOutUser = asyncHandler(async (req, res, next) => {
  try {
    // check if token exists
    const token = req.cookies?.token;
    console.log(token);

    if (!token) {
      return handleResponse(res, 400, "Already logged out.");
    }

    res.clearCookie("token", {
      httpOnly: true,
      path: "/", // Ensure it clears for the entire site
    });

    handleResponse(res, 200, "Logout successful");
  } catch (error) {
    next(error); // Passing error to global error handler
  }
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    // Fetch all users from database
    const users = await getAllUsersService();
    handleResponse(res, 200, "All users", users);
  } catch (error) {
    next(error); // Passing error to global error handler
  }
});

const getUserById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    // Fetch user by ID
    const user = await getUserByIdService(id);
    if (!user) {
      return handleResponse(res, 404, "User not found.");
    }

    handleResponse(res, 200, "We got the user !", user);
  } catch (error) {
    next(error); // Passing error to global error handler
  }
});

const updateUserById = asyncHandler(async (req, res, next) => {
  try {
    const id = Number(req.params.id); // by default params are strings
    const { name, email } = req.body;

    if (!name || !email || name.trim() === "" || email.trim() === "") {
      return handleResponse(res, 400, "Name and Email are required.");
    }

    // Validate if 'id' exists and is a number
    if (!id || isNaN(id)) {
      return handleResponse(res, 400, "Invalid user ID.");
    }

    // Update user in the database
    const updatedUser = await updateUserService(id, name, email);
    if (!updatedUser) {
      return handleResponse(res, 404, "User not found.");
    }

    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    console.error("Update user error:", error); // ✅ Log the actual error
    next(error); // Passing error to global error handler
  }
});

const deleteUserById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    // Delete user from the database
    const deletedUser = await deleteUserService(id);
    if (!deletedUser) {
      return handleResponse(res, 404, "User not found.");
    }
    handleResponse(res, 200, "User deleted successfully");
  } catch (error) {
    next(error); // Passing error to global error handler
  }
});

export {
  createUser,
  loginUser,
  logOutUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

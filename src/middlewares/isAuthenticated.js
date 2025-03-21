import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import handleResponse from "./responseHandler.js";

const JWT_SECRET = process.env.JWT_SECRET;

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token; // Get token from cookies

  if (!token) {
    return handleResponse(res, 401, "User not authenticated. Token is missing !.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    
    if (!decoded || !decoded.id) {
      return handleResponse(res, 401, "Invalid token.");
    }

    req.user = decoded.id;
    next();
  } catch (error) {
    next({
      statusCode: 401,
      message: "Authentication failed. Invalid or expired token.",
    });
  }
});

export default isAuthenticated;

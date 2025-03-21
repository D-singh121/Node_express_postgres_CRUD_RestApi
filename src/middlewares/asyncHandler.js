const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error("Error:", err); // Log error for debugging
    // Ensure a valid HTTP status code
    const statusCode =
      err.statusCode && err.statusCode >= 400 && err.statusCode < 600
        ? err.statusCode
        : 500;

    next({
      statusCode,
      message: err.message || "Internal Server Error",
    });
  }
};

export default asyncHandler;

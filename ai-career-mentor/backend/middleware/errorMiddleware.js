// Centralized error handler so all errors go through one place.

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Something went wrong. Please try again later.";

  res.status(statusCode).json({
    message,
    // Only show stack trace in development to avoid leaking details in production
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = errorHandler;


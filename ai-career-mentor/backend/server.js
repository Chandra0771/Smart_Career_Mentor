// Main Express server setup. Configures security, CORS, routes, and error handling.

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Helpful HTTP headers for basic security hardening
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// Enable request logging during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS configuration for frontend to call backend
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: false // We are using Bearer tokens in headers, not cookies
  })
);

// Simple health check route
app.get("/", (req, res) => {
  res.json({ message: "AI Career Mentor API is running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Error handler should be the last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


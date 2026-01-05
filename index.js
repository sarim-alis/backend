// Imports.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import eventRoutes from "./src/routes/event.route.js";
import userRoutes from "./src/routes/user.route.js";

// Middleware.
dotenv.config();
const app = express();

// Connect to database (non-blocking)
connectDB().catch(err => {
  console.error('Database connection error:', err);
  // Don't exit - let server start and handle DB errors gracefully
});

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development, set FRONTEND_URL in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes.
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.get("/", (req, res) => { res.send("PartyMeet API running 🎉")});

// Server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🦊🌟❤️`));

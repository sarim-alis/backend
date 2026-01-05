// Imports.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import eventRoutes from "./src/routes/event.route.js";
import userRoutes from "./src/routes/user.route.js";

// Middleware.
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes.
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.get("/", (req, res) => { res.send("PartyMeet API running 🎉")});

// Server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🦊🌟❤️`));

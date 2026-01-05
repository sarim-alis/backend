// Startup logging
console.log('🚀 Starting PartyMeet Backend...');
console.log('📦 Loading dependencies...');

// Imports.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import eventRoutes from "./src/routes/event.route.js";
import userRoutes from "./src/routes/user.route.js";

console.log('✅ Dependencies loaded');

// Middleware.
dotenv.config();
console.log('✅ Environment variables loaded');
const app = express();
console.log('✅ Express app created');

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
app.get("/", (req, res) => { 
  res.send("PartyMeet API running 🎉");
});

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: err.message 
  });
});

// Server.
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Important for Render - bind to all interfaces

app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`✅ Server running on port ${PORT} 🦊🌟❤️`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'Set ✅' : 'NOT SET ❌'}`);
  console.log(`🚀 Server ready at http://${HOST}:${PORT}`);
  console.log('='.repeat(50));
});

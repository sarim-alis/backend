// Imports.
import express from "express";
import * as eventController from "../controller/event.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.get("/", authenticate, eventController.getEvents);
router.post("/", authenticate, eventController.createEvent);
router.post("/:id/join", authenticate, eventController.joinEvent);
router.post("/:id/leave", authenticate, eventController.leaveEvent);
router.delete("/:id", authenticate, eventController.deleteEvent);

export default router;

import * as eventService from "../service/event.service.js";
import User from "../models/User.model.js";

// Check if user is admin
const checkIsAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user && user.role === "admin";
};

// Get all events
export const getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, view } = req.query; // view: 'all' or 'joined'

    const userIsAdmin = await checkIsAdmin(userId);

    let events;
    if (view === "joined") {
      // Get events user has joined
      events = await eventService.getJoinedEvents(userId, category);
    } else {
      // Get all events (for browsing)
      events = await eventService.getAllEvents(category);
    }

    // Add isJoined flag for each event
    events = events.map((event) => ({
      ...event,
      isJoined: event.participants.some((id) => id.toString() === userId.toString()),
    }));

    res.status(200).json({
      success: true,
      data: events,
      isAdmin: userIsAdmin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch events",
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const event = await eventService.getEventById(id, userId);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch event",
    });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, date, location, category } = req.body;

    if (!name || !date || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, date, and location are required",
      });
    }

    const event = await eventService.createEvent({
      name,
      date,
      location,
      category,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

// Join event
export const joinEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await eventService.joinEvent(id, userId);

    res.status(200).json({
      success: true,
      message: "Successfully joined event",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to join event",
    });
  }
};

// Leave event
export const leaveEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await eventService.leaveEvent(id, userId);

    res.status(200).json({
      success: true,
      message: "Successfully left event",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to leave event",
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, date, location, category } = req.body;

    const event = await eventService.updateEvent(id, userId, {
      name,
      date,
      location,
      category,
    });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await eventService.deleteEvent(id, userId);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete event",
    });
  }
};


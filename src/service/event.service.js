import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

// Check if user is admin
const isAdmin = async (userId) => {
  const user = await User.findById(userId);
  return user && user.email === "admin@gmail.com";
};

// Get all events (for all users to see)
export const getAllEvents = async (category = null) => {
  const query = category && category !== "All" ? { category } : {};
  const events = await Event.find(query).populate("userId", "username email").sort({ date: 1 });
  
  return events.map((event) => ({
    id: event._id,
    name: event.name,
    date: event.date,
    location: event.location,
    category: event.category,
    createdBy: {
      id: event.userId._id,
      username: event.userId.username,
      email: event.userId.email,
    },
    participants: event.participants || [],
    participantsCount: event.participants?.length || 0,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));
};

// Get events user has joined
export const getJoinedEvents = async (userId, category = null) => {
  const query = { participants: userId };
  if (category && category !== "All") {
    query.category = category;
  }
  const events = await Event.find(query).populate("userId", "username email").sort({ date: 1 });
  
  return events.map((event) => ({
    id: event._id,
    name: event.name,
    date: event.date,
    location: event.location,
    category: event.category,
    createdBy: {
      id: event.userId._id,
      username: event.userId.username,
      email: event.userId.email,
    },
    participants: event.participants || [],
    participantsCount: event.participants?.length || 0,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  }));
};

// Create new event (admin only)
export const createEvent = async (eventData) => {
  const { name, date, location, category, userId } = eventData;

  // Check if user is admin
  const userIsAdmin = await isAdmin(userId);
  if (!userIsAdmin) {
    throw new Error("Only admin can create events");
  }

  const event = await Event.create({
    name,
    date,
    location,
    category: category || "Other",
    userId,
    participants: [],
  });

  return {
    id: event._id,
    name: event.name,
    date: event.date,
    location: event.location,
    category: event.category,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
};

// Join event
export const joinEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user already joined
  if (event.participants.includes(userId)) {
    throw new Error("You have already joined this event");
  }

  // Add user to participants
  event.participants.push(userId);
  await event.save();

  return {
    id: event._id,
    participantsCount: event.participants.length,
  };
};

// Leave event
export const leaveEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  // Remove user from participants
  event.participants = event.participants.filter((id) => id.toString() !== userId.toString());
  await event.save();

  return {
    id: event._id,
    participantsCount: event.participants.length,
  };
};

// Delete event (admin only)
export const deleteEvent = async (eventId, userId) => {
  const userIsAdmin = await isAdmin(userId);
  if (!userIsAdmin) {
    throw new Error("Only admin can delete events");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  await Event.findByIdAndDelete(eventId);
  return true;
};


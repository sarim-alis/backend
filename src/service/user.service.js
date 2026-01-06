// Imports.
import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "james";

// Register user.
export const registerUser = async (userData) => {
  const { username, email, password, imageUrl } = userData;

  // Check if user already exists.
  const existingUser = await User.findOne({ $or: [{ email }, { username }]});

  if (existingUser) { throw new Error("User with this email or username already exists");}
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user.
  const user = await User.create({ username, email, password: hashedPassword, imageUrl: imageUrl || null });

  // Generate JWT token.
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "1d" });

  return { token, user: { id: user._id, username: user.username, email: user.email, imageUrl: user.imageUrl, role: user.role, createdAt: user.createdAt, isAdmin: user.role === "admin" }};
};

// Login user
export const loginUser = async (email, password) => {
  // Find user by email.
  const user = await User.findOne({ email });

  if (!user) { throw new Error("Invalid email or password");}

  // Verify password.
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) { throw new Error("Invalid email or password");}

  // Generate JWT token.
  const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  return { token, user: { id: user._id, username: user.username, email: user.email, imageUrl: user.imageUrl, role: user.role, isAdmin: user.role === "admin" }};
};

// Get user by ID.
export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) { throw new Error("User not found");}

  return { id: user._id, username: user.username, email: user.email, imageUrl: user.imageUrl, role: user.role, createdAt: user.createdAt, isAdmin: user.role === "admin" };
};

// Update user profile.
export const updateUser = async (userId, updateData) => {
  const { username, email, imageUrl } = updateData;

  // Check if username or email is taken by another user.
  if (username || email) {
    const orConditions = [];
    if (username) orConditions.push({ username });
    if (email) orConditions.push({ email });

    const existingUser = await User.findOne({
      $and: [{ _id: { $ne: userId } }, { $or: orConditions }],
    });

    if (existingUser) { throw new Error("Username or email already taken");}
  }

  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (imageUrl !== undefined) updateFields.imageUrl = imageUrl;

  const user = await User.findByIdAndUpdate( userId, updateFields, { new: true, runValidators: true });
  if (!user) { throw new Error("User not found");}

  return { id: user._id, username: user.username, email: user.email, imageUrl: user.imageUrl, role: user.role, updatedAt: user.updatedAt, isAdmin: user.role === "admin" };
};

// Imports.
import * as userService from "../service/user.service.js";
import { uploadToCloudinary } from "../../utils/cloudinary.js";

// Register.
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let imageUrl = null;

    // Upload image.
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Validation.
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Username, email, and password are required" });
    }
    const result = await userService.registerUser({ username, email, password, imageUrl });

    res.status(201).json({ success: true, message: "User registered successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Registration failed" });
  }
};

// Login.
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation.
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const result = await userService.loginUser(email, password);

    res.status(200).json({ success: true, message: "Login successful", data: result });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message || "Login failed" });
  }
};

// Get user profile.
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await userService.getUserById(userId);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message || "User not found" });
  }
};

// Update user profile.
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email } = req.body;
    let imageUrl = undefined;

    // Upload new image.
    if (req.file) { imageUrl = await uploadToCloudinary(req.file.buffer);}

    const user = await userService.updateUser(userId, { username, email, imageUrl });

    res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || "Update failed" });
  }
};

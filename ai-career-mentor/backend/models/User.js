// Lightweight in-memory "User model" with a Mongoose-like API.
// This replaces MongoDB so the app can run without a database.

const bcrypt = require("bcryptjs");

// In-memory array where we keep all users while the server is running.
// Note: This is NOT persistent storage. Data will reset whenever the server restarts.
const users = [];
let idCounter = 1;

class User {
  constructor({ name, email, password, role, careerInterest, skillLevel }) {
    this._id = `${idCounter++}`;
    this.name = name;
    this.email = email.toLowerCase().trim();
    this.password = password; // plain text at first; we will hash in save()
    this.role = role || "Student";
    this.careerInterest = careerInterest || "";
    this.skillLevel = skillLevel || "Beginner";
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Hash password (if it is not already hashed) and store user in memory.
  async save() {
    // Check if password looks like a bcrypt hash (very rough check)
    const isHashed = typeof this.password === "string" && this.password.startsWith("$2");
    if (!isHashed) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    const existingIndex = users.findIndex((u) => u._id === this._id);
    this.updatedAt = new Date();

    if (existingIndex === -1) {
      users.push(this);
    } else {
      users[existingIndex] = this;
    }

    return this;
  }

  // Compare entered password with the stored hashed password.
  async matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  // Return a safe JSON representation without the password hash.
  toJSON() {
    const { password, ...rest } = this;
    return rest;
  }

  // ---- Static helper methods (roughly similar to Mongoose) ----

  static async findOne(query) {
    if (query.email) {
      const email = query.email.toLowerCase().trim();
      return users.find((u) => u.email === email) || null;
    }
    return null;
  }

  static async findById(id) {
    return users.find((u) => u._id === String(id)) || null;
  }

  static async create(data) {
    const user = new User(data);
    await user.save();
    return user;
  }
}

module.exports = User;


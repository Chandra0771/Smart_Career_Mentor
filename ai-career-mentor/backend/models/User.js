// User model for storing registered users in MongoDB.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your full name"]
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false // Do not return password by default
    },
    role: {
      type: String,
      enum: ["Student", "Working Professional"],
      default: "Student"
    },
    careerInterest: {
      type: String,
      default: ""
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Hash password automatically before saving if it was modified.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method for comparing plain password with hashed password.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields when converting to JSON.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;


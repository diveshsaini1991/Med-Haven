import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env.example" });

import mongoose from "mongoose";
import { dbConnection } from "./database/dbconnection.js";
import { User } from "./models/userSchema.js";

async function seed() {
  await dbConnection();

  const defaultEmail = "admin@medhaven.com";
  const existingUser = await User.findOne({ email: defaultEmail });

  if (!existingUser) {
    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: defaultEmail,
      phone: "1234567890",
      aadhaar: "123456789012",
      dob: new Date("1990-01-01"),
      gender: "Male",
      password: "admin123", // Will be hashed by pre-save hook
      role: "Admin"
    });
    console.log("Default admin user created.");
  } else {
    console.log("Default admin user already exists.");
  }

  mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  mongoose.connection.close();
}); 
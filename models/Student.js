// models/Student.js
import { Schema, model } from "mongoose";

const StudentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  interests: [String], // Array of interests
  challenges: [String], // Array of challenges
  createdAt: { type: Date, default: Date.now },
});

export default model("Student", StudentSchema);

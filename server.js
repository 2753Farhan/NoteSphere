import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";

config();
connectDB();

const app = express();
app.use(cors());
app.use(json());

app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

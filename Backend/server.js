import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// ROUTES
app.use("/api/scholarships", scholarshipRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error in MongoDB connection", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App running on port: ${PORT}`));

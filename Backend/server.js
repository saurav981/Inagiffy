import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// ROUTES
app.use("/api/scholarships", scholarshipRoutes);

// ping this every 10 minutes using UptimeRobot to keep server alive, and avoid cold start
app.get("/health", (req, res) => res.sendStatus(200));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error in MongoDB connection", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`App running on port: ${PORT}`));

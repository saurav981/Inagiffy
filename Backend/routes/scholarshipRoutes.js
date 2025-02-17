import express from "express";
import { searchScholarships } from "../controllers/scholarshipController.js";

const router = express.Router();

router.post("/search", searchScholarships);

export default router;

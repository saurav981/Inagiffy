import mongoose from "mongoose";

const ScholarshipSchema = new mongoose.Schema({
  title: String,
  description: String,
  caste: String,
  religion: String,
  collegeType: String,
  embedding: { type: [Number], default: [] }, // for AI embeddings
});

const ScholarshipModel = mongoose.model("Scholarship", ScholarshipSchema);

export default ScholarshipModel;

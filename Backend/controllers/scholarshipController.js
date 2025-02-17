import { getEmbedding } from "../utils/embeddings.js";
import ScholarshipModel from "../models/ScholarshipModel.js";

export const searchScholarships = async (req, res) => {
  try {
    const { query, caste, religion, collegeType } = req.body;
    console.log(query);

    let scholarships;

    if (query) {
      const queryEmbedding = await getEmbedding(query);

      scholarships = await ScholarshipModel.find({
        embedding: { $exists: true, $ne: [] }, // Ensure embeddings exist
        ...(caste && { caste }),
        ...(religion && { religion }),
        ...(collegeType && { collegeType }),
      });

      if (!scholarships.length) {
        return res.json({ message: "No scholarships found." });
      }

      scholarships = scholarships
        .map((scholarship) => {
          const similarity = cosineSimilarity(
            queryEmbedding,
            scholarship.embedding
          );

          return {
            ...scholarship.toObject(),
            similarity,
          };
        })
        .filter((s) => s.similarity > 0.1) // filter out irrelevant results
        .sort((a, b) => b.similarity - a.similarity);
    } else {
      scholarships = await ScholarshipModel.find({
        ...(caste && { caste }),
        ...(religion && { religion }),
        ...(collegeType && { collegeType }),
      });
    }

    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
};

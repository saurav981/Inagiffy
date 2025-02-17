import { pipeline } from "@xenova/transformers";
import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DB_NAME);
const collection = db.collection("scholarships");

const embedder = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

async function generateEmbeddings() {
  await client.connect();

  const scholarships = await collection
    .find({ embedding: { $size: 0 } })
    .toArray();

  for (const scholarship of scholarships) {
    // Old, same weightage on title and desc
    // const text = ${scholarship.title} ${scholarship.description};
    // const embedding = await embedder(text, {
    //   pooling: "mean",
    //   normalize: true,
    // });

    // Doing this to give 60% weight to tilte, 40% to desc
    const titleWeighted = `${scholarship.title} `.repeat(6);
    const descriptionWeighted = `${scholarship.description} `.repeat(4);

    const weightedText = `${titleWeighted} ${descriptionWeighted}`;

    const embedding = await embedder(weightedText, {
      pooling: "mean",
      normalize: true,
    });

    const embeddingArray = Object.values(embedding.data);

    await collection.updateOne(
      { _id: scholarship._id },
      { $set: { embedding: embeddingArray } }
    );
  }

  console.log("Embeddings saved in DB");
  await client.close();
}

generateEmbeddings().catch(console.error);

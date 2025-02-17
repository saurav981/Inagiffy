import { pipeline } from "@xenova/transformers";

let embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

export async function getEmbedding(text) {
  const embedder = await embedderPromise;
  const output = await embedder(text, { pooling: "mean", normalize: true });
  return Object.values(output.data);
}

import fs from "fs";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import dotenv from 'dotenv';

dotenv.config();

const VECTOR_STORE_PATH = "./PDFDocument.json"; // Ensure this path is correct

async function loadVectorStore() {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
        console.log("Loading existing vector store...");
        const rawData = fs.readFileSync(VECTOR_STORE_PATH, 'utf-8');
        const parsedData = JSON.parse(rawData);

        // Reconstruct the vector store
        const embeddings = new OpenAIEmbeddings();
        const vectorStore = new MemoryVectorStore(embeddings);
        vectorStore.memoryVectors = parsedData;
        return vectorStore;
    } else {
        throw new Error(`Vector store file not found: ${VECTOR_STORE_PATH}`);
    }
}

export { loadVectorStore };

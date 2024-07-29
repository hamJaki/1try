// vectorStore.js
import { loadVectorStore } from './PDFLoader.js'; // Corrected function name

let vectorStore = null;

export async function initializeVectorStore() {
    try {
        vectorStore = await loadVectorStore();
        console.log("Vector store initialized successfully");
    } catch (error) {
        console.error("Error initializing vector store:", error);
        throw error;
    }
}

export function getVectorStore() {
    if (!vectorStore) {
        throw new Error("Vector store not initialized");
    }
    return vectorStore;
}

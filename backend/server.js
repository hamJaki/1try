// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initializeVectorStore } from './vectorStore.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

const startServer = async () => {
    try {
        await initializeVectorStore();
        console.log('Vector store initialization complete');

        // Use routes
        app.use('/api/chat', chatRoutes);
        app.use('/api/auth', authRoutes);

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize vector store:', error);
        process.exit(1); // Exit the process if vector store initialization fails
    }
};

startServer();

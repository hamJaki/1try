import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { initializeVectorStore } from './vectorStore.js';
import { generateOpenAIResponse } from './routes/generateOpenAIResponse.js'; // Ensure this import is correct

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://discreteai-jgw0qsd0x-hamjakis-projects.vercel.app", // Ensure this is your frontend URL
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async ({ userId, message, chatType, relevantInfo }) => {
        try {
            const response = await generateOpenAIResponse(userId, message, chatType, relevantInfo);
            socket.emit('botReply', response);
        } catch (error) {
            console.error('Error:', error);
            socket.emit('error', 'An error occurred while processing your request.');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const startServer = async () => {
    try {
        await initializeVectorStore();
        console.log('Vector store initialization complete');

        // Use routes
        app.use('/api/chat', chatRoutes);
        app.use('/api/auth', authRoutes);

        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize vector store:', error);
        process.exit(1); // Exit the process if vector store initialization fails
    }
};

startServer();

// chatRoutes.js
import express from 'express';
import { generateOpenAIResponse } from './generateOpenAIResponse.js';
import { protect } from '../middleware/authMiddleware.js';
import Chat from '../models/Chat.js';
import { getVectorStore } from '../vectorStore.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    console.log('User from request:', req.user);
    const { message, chatType } = req.body; // Ensure chatType is included in the request body
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const vectorStore = getVectorStore();
        if (!vectorStore) {
            throw new Error('Vector store not initialized');
        }

        const relevantDocs = await vectorStore.similaritySearch(message, 3);
        const relevantInfo = relevantDocs.map(doc => doc.pageContent).join('\n\n');

        const response = await generateOpenAIResponse(req.user._id, message, chatType, relevantInfo);

        res.json({ response });
    } catch (error) {
        console.error('Error in chat route:', error);
        res.status(500).json({ error: 'Error generating response', details: error.message });
    }
});

router.get('/history/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;
        const { chatType } = req.query;

        if (req.user._id.toString() !== userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const chatHistory = await Chat.find({ userId, chatType }).sort({ timestamp: 1 });
        res.json({ chatHistory });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Error fetching chat history' });
    }
});

export default router;

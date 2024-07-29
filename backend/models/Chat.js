// Chat.js
import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    chatType: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    parts: [
        {
            text: { type: String, required: true },
        },
    ],
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

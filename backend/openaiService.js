const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Chat = require('./models/Chat'); // Предполагается, что у вас есть модель для хранения чатов

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function processPDF(filePath, userId) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const pdfText = data.text;

    await Chat.create({ userId, role: 'system', parts: [{ text: pdfText }] });
    console.log(`PDF content saved for user ${userId}`);
}

const userId = 'some-unique-user-id';
const pdfPath = path.join(__dirname, './dmo3-tablet.pdf');

processPDF(pdfPath, userId)
    .then(() => mongoose.disconnect())
    .catch(error => {
        console.error('Error processing PDF file:', error);
        mongoose.disconnect();
    });

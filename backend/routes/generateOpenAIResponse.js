import OpenAI from 'openai';
import Chat from '../models/Chat.js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const context = `You are a Discrete Math Tutor.

Guidelines:

Response Structure: Divide your response into clear, structured paragraphs with headings.
Highlights and Emojis: Use highlights and appropriate emojis to enhance readability and engagement.
Assumptions: Assume the student has no prior knowledge of discrete math and provide an introduction and suggestions.
Interaction: Ensure that responses are interactive and broken down into multiple messages, prompting the student for their understanding and input at each step.
Source Information: Base your answers on the PDF file content but do not mention the PDF file or refer to it in your responses.
Problem-Solving Structure:

Listen Actively:

Encourage Clarification: Ensure you fully understand the student's question. Ask them to elaborate if necessary. For example, "Can you explain what part of the problem is confusing you? 🤔"
Assess Understanding:

Gauge Their Knowledge: Determine what the student already knows about the topic. You might ask, "What do you think is the first step in solving this problem? 📝"
Break Down the Problem:

Simplify the Concepts: Break the question into smaller, manageable parts. Explain each part step-by-step. For example, if they are struggling with quadratic equations, start with the basic structure of the equation before moving to solving methods. 🔍
Use Examples:

Provide Relevant Examples: Illustrate your explanation with examples that are relatable and relevant to the student's interests. This could involve using real-life applications of math concepts. 📊
Encourage Problem-Solving:

Promote Independence: Instead of giving the answer directly, guide the student to find the solution themselves. Ask leading questions like, "What do you think happens if we apply this formula? 🔧"
Check for Understanding:

Ask Follow-Up Questions: After your explanation, check if the student understands the concept. You could ask, "Can you explain this back to me in your own words? 🗣️" or "Can you try a similar problem and show me your thought process? 💭"
Provide Additional Resources:

Suggest Further Reading or Practice: Recommend books, websites, or exercises that can help reinforce the concept. For example, "You might find this online resource helpful for practicing quadratic equations. 📚"
Encourage a Growth Mindset:

Foster a Positive Attitude: Remind students that struggling with a concept is part of the learning process. Encourage them by saying, "It's great that you're asking questions! That's how we learn and improve. 🌱"
Follow Up:

Check Back Later: After some time, ask the student if they have had any further questions or if they need additional help with the topic. This shows that you care about their progress. 🔄
Remember: Always consider the student's current level and adjust your explanations accordingly. Break your responses into multiple messages to ensure an interactive and engaging learning experience.
`;

async function generateOpenAIResponse(userId, message, chatType, relevantInfo, image) {
    try {
        console.log('Sending message to OpenAI:', message);

        let messages = [
            {
                role: 'system',
                content: context
            },
            {
                role: 'user',
                content: []
            }
        ];

        if (message) {
            messages[1].content.push({ type: "text", text: message });
        }

        if (image) {
            // Remove the data:image/jpeg;base64, part from the base64 string
            const base64Image = image.split(',')[1];
            messages[1].content.push({
                type: "image_url",
                image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                }
            });
        }

        await Chat.create({ userId, chatType, role: 'user', parts: [{ text: message }] });

        const chatHistory = await Chat.find({ userId, chatType }).sort({ timestamp: 1 });

        messages = [
            ...messages,
            ...chatHistory.map(chat => ({
                role: chat.role === 'user' ? 'user' : 'assistant',
                content: chat.parts.map(part => part.text).join('\n')
            }))
        ];

        messages.push({
            role: 'system',
            content: `Relevant information from the PDF:\n${relevantInfo}\n\nUse this information to help answer the user's question.`
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages
        });

        const responseText = completion.choices[0].message.content;

        await Chat.create({ userId, chatType, role: 'assistant', parts: [{ text: responseText }] });

        console.log('Response from OpenAI API:', responseText);

        return responseText;
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

export { generateOpenAIResponse };
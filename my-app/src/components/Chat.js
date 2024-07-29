import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import '../styles/Chat.css'; // Adjust the path as needed
import Logo from '../images/logotype.png'; // Adjust the path as needed

const chatOptions = [
    { id: 'foundations', name: 'The Foundations: Logic and Proofs', icon: '📘', docUrl: '/texfiles/the_foundations__logic_and_proofs.tex' },
    { id: 'basic-structures', name: 'Basic Structures: Sets, Functions, Sequences, Sums, and Matrices', icon: '🔢', docUrl: '/texfiles/basic_structures__sets__functions__sequences__sums__and_matrices.tex' },
    { id: 'algorithms', name: 'Algorithms', icon: '🤖', docUrl: '/texfiles/algorithms.tex' },
    { id: 'number-theory-and-cryptography', name: 'Number Theory and Cryptography', icon: '🔑', docUrl: '/texfiles/number_theory_and_cryptography.tex' },
    { id: 'induction-and-recursion', name: 'Induction and Recursion', icon: '🔄', docUrl: '/texfiles/induction_and_recursion.tex' },
    { id: 'counting', name: 'Counting', icon: '🔢', docUrl: '/texfiles/counting.tex' },
    { id: 'discrete-probability', name: 'Discrete Probability', icon: '🎲', docUrl: '/texfiles/discrete_probability.tex' },
    { id: 'advanced-counting-techniques', name: 'Advanced Counting Techniques', icon: '📈', docUrl: '/texfiles/advanced_counting_techniques.tex' },
    { id: 'relations', name: 'Relations', icon: '🔗', docUrl: '/texfiles/relations.tex' },
    { id: 'graphs', name: 'Graphs', icon: '📊', docUrl: '/texfiles/graphs.tex' },
    { id: 'trees', name: 'Trees', icon: '🌳', docUrl: '/texfiles/trees.tex' },
    { id: 'boolean-algebra', name: 'Boolean Algebra', icon: '🟢', docUrl: '/texfiles/boolean_algebra.tex' },
    { id: 'modeling-computation', name: 'Modeling Computation', icon: '🧮', docUrl: '/texfiles/modeling_computation.tex' },
];

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeChat, setActiveChat] = useState('foundations');
    const [latexContent, setLatexContent] = useState('');
    const [showLatex, setShowLatex] = useState(false);
    const messagesEndRef = useRef(null);
    const API_URL = 'https://1try-production.up.railway.app';
    const navigate = useNavigate();

    useEffect(() => {
        fetchChatHistory();
    }, [activeChat]);

    useEffect(() => {
        if (activeChatOption?.docUrl) {
            fetch(activeChatOption.docUrl)
                .then(response => response.text())
                .then(data => setLatexContent(data))
                .catch(error => console.error('Error fetching LaTeX content:', error));
        }
    }, [activeChat]);

    const activeChatOption = chatOptions.find(option => option.id === activeChat);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatHistory = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user._id;
            const response = await axios.get(`${API_URL}/api/chat/history/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: { chatType: activeChat }
            });
            setMessages(response.data.chatHistory.map(chat => ({
                text: chat.parts.map(part => part.text).join(' '),
                user: chat.role === 'user'
            })));
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const handleChatChange = (chatId) => {
        setMessages([]);
        setActiveChat(chatId);
    };

    const getChatContext = (chatId) => {
        switch (chatId) {
            case 'foundations':
                return "You are an AI tutor explaining the foundations of discrete mathematics, covering topics such as propositional logic, predicates and quantifiers, and various proof methods.";
            case 'basic-structures':
                return "You are an AI tutor explaining basic structures in discrete mathematics, including sets, set operations, functions, sequences, summations, and matrices.";
            case 'algorithms':
                return "You are an AI tutor discussing algorithms, their growth, and complexity, providing insights into how they function and can be optimized.";
            case 'number-theory-and-cryptography':
                return "You are an AI tutor covering number theory and cryptography, explaining concepts like divisibility, modular arithmetic, and cryptographic methods.";
            case 'induction-and-recursion':
                return "You are an AI tutor explaining induction and recursion, including mathematical induction, strong induction, recursive definitions, and program correctness.";
            case 'counting':
                return "You are an AI tutor covering counting principles, such as the basics of counting, permutations, combinations, and the pigeonhole principle.";
            case 'discrete-probability':
                return "You are an AI tutor explaining discrete probability, including the basics of probability theory, Bayes' theorem, and calculations of expected value and variance.";
            case 'advanced-counting-techniques':
                return "You are an AI tutor discussing advanced counting techniques, such as recurrence relations, generating functions, and inclusion-exclusion principles.";
            case 'relations':
                return "You are an AI tutor explaining relations, including properties of relations, n-ary relations, equivalence relations, and partial orderings.";
            case 'graphs':
                return "You are an AI tutor covering graph theory, including topics like graph terminology, special types of graphs, connectivity, Euler and Hamilton paths, and graph coloring.";
            case 'trees':
                return "You are an AI tutor explaining trees, including their properties, applications, traversal techniques, and spanning trees.";
            case 'boolean-algebra':
                return "You are an AI tutor discussing Boolean algebra, including Boolean functions, logic gates, and circuit minimization techniques.";
            case 'modeling-computation':
                return "You are an AI tutor explaining modeling computation, covering languages and grammars, finite-state machines, and Turing machines.";
            default:
                return "";
        }
    };

    const saveMessage = async (message, isUser) => {
        try {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user._id;
            await axios.post(`${API_URL}/api/chat/save`, {
                userId,
                chatType: activeChat,
                role: isUser ? 'user' : 'assistant',
                parts: [{ text: message }]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, user: true };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        await saveMessage(input, true);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const context = getChatContext(activeChat);
            const response = await axios.post(`${API_URL}/api/chat`, {
                message: input,
                chatType: activeChat,
                context: context
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const botMessage = { text: response.data.response, user: false };
            setMessages(prevMessages => [...prevMessages, botMessage]);
            await saveMessage(response.data.response, false);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { text: "Sorry, I couldn't process your request.", user: false };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
            await saveMessage(errorMessage.text, false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    };

    const handleDocumentClick = async (docUrl) => {
        try {
            const response = await fetch(docUrl);
            const content = await response.text();
            setLatexContent(content);
            setShowLatex(true);
        } catch (error) {
            console.error('Error fetching LaTeX content:', error);
        }
    };

    const LaTeXModal = ({ content, onClose }) => (
        <div className="latex-modal">
            <div className="latex-modal-content">
                <button onClick={onClose} className="close-button">×</button>
                <MathJaxContext>
                    <div className="latex-content">
                        <MathJax dynamic>{content}</MathJax>
                    </div>
                </MathJaxContext>
                <button onClick={onClose} className="bottom-close-button">Close</button>
            </div>
        </div>
    );

    const renderMessage = (message) => {
        const regex = /\$.*?\$/g;
        const parts = message.text.split(regex);
        const latexParts = message.text.match(regex);

        if (!latexParts) {
            return <ReactMarkdown>{message.text}</ReactMarkdown>;
        }

        return parts.map((part, index) => (
            <span key={index}>
                <ReactMarkdown>{part}</ReactMarkdown>
                {latexParts[index] && <MathJax dynamic>{latexParts[index]}</MathJax>}
            </span>
        ));
    };

    return (
        <div className="chat-custom-container">
            <div className="chat-custom-sidebar">
                <div className="chat-custom-logo">
                    <img src={Logo} alt="Logo"/>
                </div>
                <nav className="chat-custom-nav">
                    <div className="chat-custom-options-container">
                        {chatOptions.map((option) => (
                            <motion.button
                                key={option.id}
                                className={`chat-custom-option ${activeChat === option.id ? 'active' : ''}`}
                                onClick={() => handleChatChange(option.id)}
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                            >
                                <span className="chat-custom-option-icon">{option.icon}</span>
                                {option.name}
                            </motion.button>
                        ))}
                    </div>
                </nav>
            </div>
            <div className="chat-custom-main">
                <div className="chat-custom-header">
                    <h1>AI Chat Assistant - {activeChatOption?.name}</h1>
                    <button onClick={handleLogout} className="chat-custom-logout-button" title="Log out">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2"
                             fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                    {activeChatOption?.docUrl && (
                        <button
                            onClick={() => handleDocumentClick(activeChatOption.docUrl)}
                            className="doc-link-button"
                        >
                            📄 View Documentation
                        </button>
                    )}
                </div>
                <div className="chat-custom-messages-container">
                    <MathJaxContext>
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    className={`chat-custom-message ${message.user ? 'chat-custom-user' : 'chat-custom-bot'}`}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -20}}
                                    transition={{duration: 0.3}}
                                >
                                    {renderMessage(message)}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </MathJaxContext>
                    {isLoading && (
                        <div className="chat-custom-message chat-custom-bot loading">
                            <div className="chat-custom-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef}/>
                </div>
                <div className="chat-custom-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading}
                        className="chat-custom-send-button"
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2"
                             fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
            {showLatex && (
                <LaTeXModal
                    content={latexContent}
                    onClose={() => setShowLatex(false)}
                />
            )}
        </div>
    );
}

export default Chat;

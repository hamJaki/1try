import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import '../styles/Chat.css';
import Logo from '../images/logotype.png';
import { FaPaperPlane, FaMicrophone, FaVolumeUp, FaVolumeMute, FaImage, FaStop, FaPlay } from 'react-icons/fa';

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
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);
    const recognition = useRef(null);
    const fileInputRef = useRef(null);
    const synth = window.speechSynthesis;
    const API_URL = 'https://1try-production.up.railway.app';
    const navigate = useNavigate();

    useEffect(() => {
        fetchChatHistory();
        setupSpeechRecognition();
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

        if (window.innerWidth < 768) {
            setSidebarVisible(false);
        }
    };

    const getChatContext = (chatId) => {
        // ... (keep your existing getChatContext function)
    };

    const setupSpeechRecognition = () => {
        recognition.current = new window.webkitSpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');

            setInput(transcript);
        };
    };

    const toggleListening = () => {
        if (isListening) {
            recognition.current.stop();
        } else {
            recognition.current.start();
        }
        setIsListening(!isListening);
    };

    const speakMessage = (text, index) => {
        setMessages(prev => prev.map((msg, i) =>
            i === index ? { ...msg, isSpeaking: true } : msg
        ));
        const speech = new SpeechSynthesisUtterance(text);
        speech.onend = () => setMessages(prev => prev.map((msg, i) =>
            i === index ? { ...msg, isSpeaking: false } : msg
        ));
        synth.speak(speech);
    };

    const stopSpeaking = (index) => {
        synth.cancel();
        setMessages(prev => prev.map((msg, i) =>
            i === index ? { ...msg, isSpeaking: false } : msg
        ));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                alert('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    const sendMessage = async () => {
        if (input.trim() === '' && !image) return;

        const userMessage = { text: input, user: true, image };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setImage(null);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user._id;
            const context = getChatContext(activeChat);
            const response = await axios.post(`${API_URL}/api/chat`, {
                userId,
                message: input,
                chatType: activeChat,
                context: context,
                image: image
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const botMessage = { text: response.data.response, user: false };
            setMessages(prevMessages => [...prevMessages, botMessage]);
            if (autoSpeak) speakMessage(response.data.response, messages.length);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { text: "Sorry, I couldn't process your request.", user: false };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
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

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
        const chatContainer = document.querySelector('.chat-custom-container');
        if (chatContainer) {
            if (!sidebarVisible) {
                chatContainer.classList.add('sidebar-visible');
            } else {
                chatContainer.classList.remove('sidebar-visible');
            }
        }
    };

    const LaTeXModal = ({ content, onClose }) => (
        <div className="latex-modal">
            <div className="latex-modal-content">
                <button onClick={onClose} className="close-button">×</button>
                <div className="latex-content">
                    <Latex>{`$$${content}$$`}</Latex>
                </div>
                <button onClick={onClose} className="bottom-close-button">Close</button>
            </div>
        </div>
    );

    const renderMessage = (message) => {
        const parts = message.text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);
        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                return <Latex key={index}>{part}</Latex>;
            } else if (part.startsWith('$') && part.endsWith('$')) {
                return <Latex key={index}>{part}</Latex>
            } else {
                return <ReactMarkdown key={index}>{part}</ReactMarkdown>;
            }
        });
    };

    return (
        <div className="chat-custom-container">
            <div className={`chat-custom-sidebar ${sidebarVisible ? 'visible' : ''}`}>
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
            <div className={`chat-custom-main ${sidebarVisible ? 'sidebar-visible' : ''}`}>
                <div className="chat-custom-header">
                    <span className="hamburger-menu" onClick={toggleSidebar}>&#9776;</span>
                    <h1>AI Chat Assistant - {activeChatOption?.name}</h1>

                    <div className="chat-custom-header-buttons">
                        {activeChatOption?.docUrl && (
                            <button
                                onClick={() => handleDocumentClick(activeChatOption.docUrl)}
                                className="doc-link-button"
                            >
                                📄 View Documentation
                            </button>
                        )}
                        <button onClick={handleLogout} className="chat-custom-logout-button" title="Log out">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2"
                                 fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="chat-custom-messages-container">
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
                                {message.image && <img src={message.image} alt="Uploaded content" className="uploaded-image" />}
                                {renderMessage(message)}
                                {!message.user && (
                                    <button
                                        onClick={() => message.isSpeaking ? stopSpeaking(index) : speakMessage(message.text, index)}
                                        className="icon-button"
                                    >
                                        {message.isSpeaking ? <FaStop /> : <FaPlay />}
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
                    <button onClick={() => fileInputRef.current.click()} className="icon-button">
                        <FaImage />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <button onClick={toggleListening} className={`icon-button ${isListening ? 'active' : ''}`}>
                        <FaMicrophone />
                    </button>
                    <button onClick={() => setAutoSpeak(!autoSpeak)} className="icon-button">
                        {autoSpeak ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>
                    <button onClick={sendMessage} className="icon-button primary">
                        <FaPaperPlane />
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
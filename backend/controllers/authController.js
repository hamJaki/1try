// authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;
    console.log('Register attempt:', { name, email, username });

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        console.log('User exists check:', userExists);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
            role: 'user', // Set a default role
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        console.log('User created:', user);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            token,
        });
    } catch (error) {
        console.error('Registration error:', error); // Log the error
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', username); // Log the username

    try {
        const user = await User.findOne({ username });
        console.log('User found:', user); // Log the user object

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                token,
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { registerUser, loginUser };

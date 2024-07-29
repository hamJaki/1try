import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route
router.get('/admin', protect, admin, (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
});

export default router;

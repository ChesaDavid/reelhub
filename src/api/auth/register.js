import express from 'express';
import User from '../../models/User.js'; // Correct path for the User model

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Create new user
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
});

// Login Route (Optional for now)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: 'Login successful.', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', details: error.message });
    }
});

export default router;

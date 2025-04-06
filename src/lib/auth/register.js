import User from '../../models/User.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

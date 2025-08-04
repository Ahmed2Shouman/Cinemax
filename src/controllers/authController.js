import bcrypt from 'bcryptjs';
import * as userModel from '../models/userModel.js';

export const signup = async (req, res) => {
    const { first_name, last_name, username, email, password } = req.body;
    try {
        const existingUserByEmail = await userModel.findUserByEmail(email);
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUserByUsername = await userModel.findUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.createUser(first_name, last_name, username, email, hashedPassword, 'regular');
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body; // Changed from email to username
    try {
        const user = await userModel.findUserByUsername(username); // Changed from findUserByEmail to findUserByUsername
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Store user in session
        req.session.user = user;

        if (user.role === 'owner' || user.role === 'supervisor' || user.role === 'admin') {
            return res.status(200).json({ message: 'Logged in successfully', user, redirectTo: '/admin' });
        }

        res.status(200).json({ message: 'Logged in successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/');
    });
};

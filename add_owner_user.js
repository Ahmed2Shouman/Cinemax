import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from './src/config/db.js';
import { createUser } from './src/models/userModel.js';

dotenv.config();

const addOwnerUser = async () => {
    const username = 'owner';
    const password = '123456';
    const email = 'owner@cinemax.com';
    const first_name = 'owner';
    const last_name = 'user';
    const role = 'owner'; // Assuming 'owner' is a valid role in your schema

    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            console.log('Owner user already exists. Skipping creation.');
            return; // Ensure the function exits here
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Use the updated createUser function which now accepts the role
        const newUser = await createUser(first_name, last_name, username, email, hashedPassword, role);
        
        console.log('Owner user added successfully:', newUser);
    } catch (error) {
        console.error('Error adding owner user:', error);
    } finally {
        pool.end(); // Close the database connection
    }
};

addOwnerUser();

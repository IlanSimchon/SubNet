const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 63341;

// Enable CORS middleware
app.use((req, res, next) => {
    // CORS settings
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/subnet_project');
const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        const { userName, password, email } = req.body;
        const newUser = new User({ userName, password, email });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to handle user sign-in
app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // User not found
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the provided password matches the stored password
        if (password === user.password) {
            res.status(200).json({ message: 'Sign-in successful' });
        } else {
            // Incorrect password
            res.status(401).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 63341;

// Enable CORS middleware
app.use((req, res, next) => {
    // CORS settings
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
const MONGODB_URI ='mongodb+srv://hen:1234@cluster0.0ejohog.mongodb.net/subNet';


// MongoDB connection
mongoose.connect(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
});

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
});

const apartmentSchema = new mongoose.Schema({
    location: String,
    pricePerNight : Number,
    availability : Object,
    reviews: [String],
    avgRate: Number,
    connectionDetails: String,
    photo: String
});//todo: fix type of availability (30)

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




const Apartment = mongoose.model('Apartment', apartmentSchema);

module.exports = Apartment;

app.get('/ApartmentByID/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        console.log("looking for: " + apartmentId + " Apartment" )
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        res.status(200).json(apartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/Apartments', async (req, res) => {
    try {
        const apartments = await Apartment.find({});
        res.status(200).json(apartments);
        console.log(apartments)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Start the server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

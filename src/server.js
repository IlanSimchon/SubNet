const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

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

const MONGODB_URI = 'mongodb+srv://hen:1234@cluster0.0ejohog.mongodb.net/subNet';

// MongoDB connection
mongoose.connect(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
});

const picSchema = new mongoose.Schema({
    photo: String
});

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    phone: String
});

const apartmentSchema = new mongoose.Schema({
    location: String,
    pricePerNight: Number,
    availability: Object,
    reviews: [String],
    avgRate: Number,
    connectionDetails: String,
    photo: [String],
    owner: String
});


const User = mongoose.model('User', userSchema);
const Apartment = mongoose.model('Apartment', apartmentSchema);
const Pic = mongoose.model('Pic', picSchema);

module.exports = Apartment;
module.exports = User;
module.exports = Pic;


app.use(bodyParser.json());

// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        const {userName, password, email, phone} = req.body;
        const newUser = new User({userName, password, email, phone});
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Route to handle user sign-in
app.post('/signin', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            // User not found
            return res.status(404).json({error: 'User not found'});
        }

        // Check if the provided password matches the stored password
        if (password === user.password) {
            res.status(200).json({user});
        } else {
            // Incorrect password
            res.status(401).json({error: 'Incorrect password'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Route to add image to an apartment (also converting the image to base 64)
app.post('/addImageToApartment', async (req, res) => {
    try {
        const {apartmentId, imagePath} = req.body;
        const base64Image = fs.readFileSync(imagePath, {encoding: 'base64'});

        // Save base64 image to pic collection
        const newPic = await Pic.create({photo: base64Image});

        // Find the apartment by ID
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({error: 'Apartment not found'});
        }

        // Add the ID of the newly created pic to the apartment's photo field
        apartment.photo.push(newPic._id);
        await apartment.save();

        res.status(200).json({message: 'Image added to apartment successfully', picId: newPic._id});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// Endpoint to add a new apartment
app.post('/addApartment', async (req, res) => {
    try {
        const newApartment = req.body;
        const createdApartment = await Apartment.create(newApartment);
        res.status(201).json(createdApartment);
    } catch (error) {
        console.error('Error adding apartment:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// A function to retrieve the current user details
function getCurrentUser(req) {
<<<<<<< HEAD
    console.log(req.session.user);
=======
    // Your logic to retrieve user details, for example, from session
>>>>>>> 148ea238c3f4ea3e5638aa5785b73f9860a9b150
    return req.session.user || null;
}

// Endpoint to get current user details
app.get('/getCurrentUser', (req, res) => {
<<<<<<< HEAD
    console.log(req.session.user);
    const currentUser = getCurrentUser(req);
    res.json(currentUser);
});

// Route to get user by name
app.get('/getUser', async (req, res) => {
    try {
        const {userName} = req.query; // Get the userName from the query parameter
        // Find the user by userName
        const user = await User.findOne({userName});

        if (!user) {
            // If user not found, return appropriate response
            return res.status(404).json({error: 'User not found'});
        }

        // If user found, return user details
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
=======
    console.log(req.session); // Log the entire session object

    // Logic to retrieve current user details, e.g., from session
    try {
        const currentUser = getCurrentUser(req);
        res.json(currentUser);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

>>>>>>> 148ea238c3f4ea3e5638aa5785b73f9860a9b150

// Route to get apartment by ID
app.get('/ApartmentByID/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        // console.log("looking for: " + apartmentId + " Apartment")
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({error: 'Apartment not found'});
        }

        res.status(200).json(apartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// Route to get all apartments or apartments of a specific user
app.get('/Apartments', async (req, res) => {
    try {
        const userName = req.query.userName; // Get the userName from the query parameter

        if (userName) {
            // If userName is provided, fetch apartments for that user only
            const apartments = await Apartment.find({owner: userName});
            res.status(200).json(apartments);
        } else {
            // If no userName provided, fetch all apartments
            const apartments = await Apartment.find({});
            res.status(200).json(apartments);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
// Start the server
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Route to get the picture of an apartment by ID
app.get('/getApartmentPic/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
            return res.status(404).json({error: 'Apartment not found'});
        }
        // Check if the apartment has a photo
        if (!apartment.photo || apartment.photo.length === 0) {
            return res.status(404).json({error: 'No photo found for the apartment'});
        }
        // Get the first photo ID from the apartment
        const picId = apartment.photo[0];
        console.log("#######");
        console.log("picId: " + picId);
        console.log("#######");

        // Find the picture in the pic collection
        const pic = await Pic.findById(picId);

        if (!pic) {
            return res.status(404).json({error: 'Photo not found'});
        }

        // Encode the base64 image to its original format
        const base64Image = pic.photo;
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Set appropriate content type for the response
        res.set('Content-Type', 'image/jpeg'); // Change the content type according to the actual image type

        // Send the image as response
        res.status(200).send(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});
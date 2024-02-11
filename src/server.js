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

const MONGODB_URI ='mongodb+srv://hen:1234@cluster0.0ejohog.mongodb.net/subNet';

// MongoDB connection
mongoose.connect(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
});

const picSchema = new mongoose.Schema({
    pic64:String
});

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    phone: String
});

const apartmentSchema = new mongoose.Schema({
    location: String,
    pricePerNight : Number,
    availability : Object,
    reviews: [String],
    avgRate: Number,
    connectionDetails: String,
    photo: String,
    owner: String
});

const User = mongoose.model('User', userSchema);
const Apartment = mongoose.model('Apartment', apartmentSchema);

app.use(bodyParser.json());

// Route to handle user registration
app.post('/register', async (req, res) => {
    try {
        const { userName, password, email, phone } = req.body;
        const newUser = new User({ userName, password, email, phone });
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
            res.status(200).json({ user });
        } else {
            // Incorrect password
            res.status(401).json({ error: 'Incorrect password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add image to an apartment (also converting the image to base 64)
app.post('/addImageToApartment', async (req, res) => {
    try {
        const { apartmentId, imagePath } = req.body;
        const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

        const apartment = await Apartment.findByIdAndUpdate(
            apartmentId,
            { photo: base64Image },
            { new: true }
        );

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        res.status(200).json(apartment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get apartment by ID
app.get('/ApartmentByID/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
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

// Route to get all apartments
// app.get('/Apartments', async (req, res) => {
//     try {
//         const apartments = await Apartment.find({});
//         res.status(200).json(apartments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// Route to get all apartments or apartments of a specific user
app.get('/Apartments', async (req, res) => {
    try {
        const userName = req.query.userName; // Get the userName from the query parameter

        if (userName) {
            // If userName is provided, fetch apartments for that user only
            const apartments = await Apartment.find({ owner: userName });
            res.status(200).json(apartments);
        } else {
            // If no userName provided, fetch all apartments
            const apartments = await Apartment.find({});
            res.status(200).json(apartments);
        }
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



// Route to get the picture of an apartment by ID
app.get('/getApartmentPic/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        const apartment = await Apartment.findById(apartmentId);
        console.log("looking for " + apartmentId)

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // Check if the apartment has a photo
        if (!apartment.photo) {
            return res.status(404).json({ error: 'No photo found for the apartment' });
        }

        // Decode the base64 image to its original format
        const base64Image = apartment.photo;
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Set appropriate content type for the response
        res.set('Content-Type', 'image/jpeg'); // Change the content type according to the actual image type

        // Send the image as response
        res.status(200).send(imageBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



































// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
//
// const app = express();
// const PORT = 63341;
//
//
// // Enable CORS middleware
// app.use((req, res, next) => {
//     // CORS settings
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     next();
// });
// const MONGODB_URI ='mongodb+srv://hen:1234@cluster0.0ejohog.mongodb.net/subNet';
//
//
// // MongoDB connection
// mongoose.connect(MONGODB_URI, {
//     tls: true,
//     tlsAllowInvalidCertificates: true,
//     tlsAllowInvalidHostnames: true,
// });
//
// const userSchema = new mongoose.Schema({
//     userName: String,
//     password: String,
//     email: String,
//     phone: String
// });
//
// const apartmentSchema = new mongoose.Schema({
//     location: String,
//     pricePerNight : Number,
//     availability : Object,
//     reviews: [String],
//     avgRate: Number,
//     connectionDetails: String,
//     photo: String
// });//todo: fix type of availability (30)
//
// const User = mongoose.model('User', userSchema);
//
// app.use(bodyParser.json());
//
// // Route to handle user registration
// app.post('/register', async (req, res) => {
//     try {
//         const { userName, password, email, phone } = req.body;
//         const newUser = new User({ userName, password, email, phone });
//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//
// // Route to handle user sign-in
// app.post('/signin', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//
//         if (!user) {
//             // User not found
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         // Check if the provided password matches the stored password
//         if (password === user.password) {
//             res.status(200).json({ user });
//         } else {
//             // Incorrect password
//             res.status(401).json({ error: 'Incorrect password' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//
//
//
//
// const Apartment = mongoose.model('Apartment', apartmentSchema);
//
// module.exports = Apartment;
//
// app.get('/ApartmentByID/:id', async (req, res) => {
//     try {
//         const apartmentId = req.params.id;
//         const apartment = await Apartment.findById(apartmentId);
//
//         if (!apartment) {
//             return res.status(404).json({ error: 'Apartment not found' });
//         }
//
//         res.status(200).json(apartment);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//
//
// app.get('/Apartments', async (req, res) => {
//     try {
//         const apartments = await Apartment.find({});
//         res.status(200).json(apartments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//
//
// // Start the server
// const HOST = process.env.HOST || '0.0.0.0';
// app.listen(PORT, HOST, () => {
//     console.log(`Server is running on http://${HOST}:${PORT}`);
// });

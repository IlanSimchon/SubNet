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
    owner: String,
    isBooked: { type: Boolean, default: false }
});
const userApartmentMappingSchema = new mongoose.Schema({
    userName: String,
    apartmentId: String
});

// Create model for UserApartmentMapping
const UserApartmentMapping = mongoose.model('UserApartmentMapping', userApartmentMappingSchema);
const User = mongoose.model('User', userSchema);
const Apartment = mongoose.model('Apartment', apartmentSchema);
const Pic = mongoose.model('Pic', picSchema);

module.exports = Apartment;
module.exports = User;
module.exports = Pic;
module.exports = UserApartmentMapping;



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

        // Save base64 image to pic collection
        const newPic = await Pic.create({ photo: base64Image });

        // Find the apartment by ID
        const apartment = await Apartment.findById(apartmentId);

        console.log("tring to add image to apartment: " + apartmentId);

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // Add the ID of the newly created pic to the apartment's photo field
        apartment.photo.push(newPic._id);
        await apartment.save();

        res.status(200).json({ message: 'Image added to apartment successfully', picId: newPic._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to add a new apartment
app.post('/addApartment', async (req, res) => {
    try {
        const { location, pricePerNight, availability, owner, connectionDetails, reviews, avgRate } = req.body;

        // Assuming you have a schema defined for Apartment
        const newApartment = new Apartment({
            location,
            pricePerNight,
            availability,
            owner,
            connectionDetails,
            reviews,
            avgRate
        });

        // Save the new apartment to the database
        const savedApartment = await newApartment.save();

        console.log("new apartment added, ID: " + savedApartment._id);

        res.status(201).json(savedApartment._id);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route to get user by name
app.get('/getUser', async (req, res) => {
    try {
        const { userName } = req.query; // Get the userName from the query parameter
        // Find the user by userName
        const user = await User.findOne({ userName });

        if (!user) {
            // If user not found, return appropriate response
            return res.status(404).json({ error: 'User not found' });
        }

        // If user found, return user details
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log(req.session); // Log the entire session object


});



// Route to get apartment by ID
app.get('/ApartmentByID/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        // console.log("looking for: " + apartmentId + " Apartment")
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
        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }
        // Check if the apartment has a photo
        if (!apartment.photo || apartment.photo.length === 0) {
            return res.status(404).json({ error: 'No photo found for the apartment' });
        }
        // Get the first photo ID from the apartment
        const picId = apartment.photo[0];


        // Find the picture in the pic collection
        const pic = await Pic.findById(picId);

        if (!pic) {
            return res.status(404).json({ error: 'Photo not found' });
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get user details by ID
app.get('/getUserDetails/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this route to server.js
app.post('/addToWishList/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { apartmentDetails } = req.body;

        // Fetch user by ID and add the apartment to their wish list
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the apartment to the wish list
        user.wishList.push(apartmentDetails);
        await user.save();

        res.status(200).json({ message: 'Apartment added to wish list successfully' });
    } catch (error) {
        console.error('Error adding apartment to wish list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this route to server.js
app.patch('/updateApartmentAvgNReviews/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        const { avgRate, review } = req.body;

        // Find the apartment by ID
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // Update the apartment with the new average rating and add the review
        apartment.avgRate = avgRate;
        apartment.reviews.push(review);
        await apartment.save();

        res.status(200).json({ message: 'Apartment updated successfully' });
    } catch (error) {
        console.error('Error updating apartment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update apartment details (location, pricePerNight, review, connectionDetails, isBooked)
app.patch('/updateApartment/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;
        const { location, pricePerNight, review, connectionDetails, isBooked } = req.body;
        // Find the apartment by ID
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // Update apartment fields if they are provided in the request body
        if (location) {
            apartment.location = location;
        }

        if (pricePerNight) {
            apartment.pricePerNight = pricePerNight;
        }

        if (review) {
            apartment.reviews.push(review);
        }

        if (connectionDetails) {
            apartment.connectionDetails = connectionDetails;
        }

        if (isBooked !== undefined) {
            apartment.isBooked = isBooked;
        }

        // Save the updated apartment
        await apartment.save();

        res.status(200).json({ message: 'Apartment updated successfully', apartment });
    } catch (error) {
        console.error('Error updating apartment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete a picture from the database
app.delete('/deletePic/:apartmentId/:picId', async (req, res) => {
    try {
        const { apartmentId, picId } = req.params;

        // Find the apartment by ID
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }
        console.log("a");

        // Find the picture by ID
        const pic = await Pic.findById(picId);
        console.log("b");

        if (!pic) {
            return res.status(404).json({ error: 'Picture not found' });
        }

        // Remove the picture ID from the apartment's 'photo' array
        const index = apartment.photo.indexOf(picId);
        console.log("c");

        if (index !== -1) {
            apartment.photo.splice(index, 1);
            await apartment.save();
        }


        // Delete the picture from the database
        await pic.remove();

        res.status(200).json({ message: 'Picture deleted successfully' });
    } catch (error) {
        console.error('Error deleting picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to delete an apartment and its associated pictures
app.delete('/deleteApartment/:id', async (req, res) => {
    try {
        const apartmentId = req.params.id;

        // Find the apartment by ID
        const apartment = await Apartment.findById(apartmentId);

        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // Delete associated pictures
        for (const picId of apartment.photo) {
            const pic = await Pic.findById(picId);
            if (pic) {
                await pic.remove();
            }
        }

        // Delete the apartment
        await apartment.remove();

        res.status(200).json({ message: 'Apartment and associated pictures deleted successfully' });
    } catch (error) {
        console.error('Error deleting apartment and associated pictures:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update user details (password, email, phone)
app.patch('/updateUser/:name', async (req, res) => {
    try {
        const userName = req.params.name;
        const { password, email, phone } = req.body;

        // Find the user by ID
        const user = await User.findOne({ userName });
        console.log("USER: " + user.toString());

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields if they are provided in the request body
        if (password) {
            user.password = password;
        }

        if (email) {
            user.email = email;
        }

        if (phone) {
            user.phone = phone;
        }

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to map user to apartment
app.post('/mapUserToApartment', async (req, res) => {
    try {
        const { userName, apartmentId } = req.body;

        // Check if both userName and apartmentId are provided
        if (!userName || !apartmentId) {
            return res.status(400).json({ error: 'Both userName and apartmentId are required' });
        }

        // Check if the user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the apartment exists
        const apartment = await Apartment.findById(apartmentId);
        if (!apartment) {
            return res.status(404).json({ error: 'Apartment not found' });
        }

        // Create a new entry in the user-apartment collection
        const userApartmentMapping = new UserApartmentMapping({ userName, apartmentId });
        await userApartmentMapping.save();

        res.status(201).json({ message: 'User mapped to apartment successfully' });
    } catch (error) {
        console.error('Error mapping user to apartment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get user renting an apartment by ApartmentID
app.get('/getUserByApartmentID/:apartmentId', async (req, res) => {
    try {
        const apartmentId = req.params.apartmentId;

        // Find the user-apartment mapping by ApartmentID
        const userApartmentMapping = await UserApartmentMapping.findOne({ apartmentId });

        if (!userApartmentMapping) {
            return res.status(404).json({ error: 'No user found for the given apartment ID' });
        }

        // Find the user by userName from the mapping
        const user = await User.findOne({ userName: userApartmentMapping.userName });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error getting user by ApartmentID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




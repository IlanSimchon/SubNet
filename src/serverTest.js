// testAddImageToApartment.js

const axios = require('axios');

async function testAddImageToApartment() {
    try {
        const imagePath = 'back.jpg'; // Replace with the path to your image
        const apartmentId = '65c4b2d7618246673b512c72'; // Replace with the ID of the apartment you want to add the image to

        // Make a POST request to the addImageToApartment endpoint
        const response = await axios.post('http://localhost:63341/addImageToApartment', {
            apartmentId: apartmentId,
            imagePath: imagePath
        });

        console.log(response.data); // Output the response from the server
    } catch (error) {
        console.error('Error:', error.response.data); // Output any errors that occurred
    }
}

async function testGetUser() {
    try {
        // Replace 'testUserName' with the username you want to test
        const userName = 'ilan';

        // Make a GET request to the getUser endpoint with the userName as a query parameter
        const response = await fetch(`http://localhost:63341/getUser?userName=${userName}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        console.log(userData); // Output the response from the server
    } catch (error) {
        console.error('Error:', error.message); // Output any errors that occurred
    }
}

async function testAddApartment() {
    try {
        // Define the apartment data you want to add
        const apartmentData = {
            location: "Test Location",
            pricePerNight: 100,
            availability: { start: "2024-02-13", end: "2024-02-20" },
            owner: "Test Owner",
            connectionDetails: "Test Connection Details",
            reviews: [],
            avgRate: 0
        };

        // Make a POST request to the addApartment endpoint
        const response = await axios.post('http://localhost:63341/addApartment', apartmentData);

        console.log( response.data); // Output the response from the server
    } catch (error) {
        console.error('Error:', error.response.data); // Output any errors that occurred
    }
}

// Function to test deleting a picture from the database
async function testDeletePic(apartmentId, picId) {
    try {
        // Send a DELETE request to the server endpoint
        const response = await fetch(`http://localhost:63341/deletePic/${apartmentId}/${picId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('Picture deleted successfully');
        } else {
            const errorMessage = await response.text();
            console.error('Error deleting picture:', errorMessage);
        }
    } catch (error) {
        console.error('Error deleting picture:', error.message);
    }
}

// Function to test updating apartment details
async function testUpdateApartment(apartmentId, updatedDetails) {
    try {
        // Send a PATCH request to the server endpoint
        const response = await fetch(`http://localhost:63341/updateApartment/${apartmentId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDetails)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Apartment updated successfully:', data);
        } else {
            const errorMessage = await response.text();
            console.error('Error updating apartment:', errorMessage);
        }
    } catch (error) {
        console.error('Error updating apartment:', error.message);
    }
}

// Example usage
const apartmentId = '65d70668db113ff7941f5831';
const picId = '65d70668db113ff7941f5833';

const updatedDetails = {
    location: 'New Location',
    pricePerNight: 150,
    review: 'Great place to stay!',
    connectionDetails: 'Updated connection details',
    isBooked: false
};


async function testUpdateUser(userId, password, email, phone) {
    try {
        // Make a PATCH request to updateUser route
        const response = await fetch(`http://localhost:63341/updateUser/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email, phone })
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error updating user details:', error);
    }
}

async function testMapUserToApartment(userName, apartmentId) {
    try {
        // Make a POST request to mapUserToApartment route
        const response = await fetch('http://localhost:63341/mapUserToApartment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userName, apartmentId })
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error mapping user to apartment:', error);
    }
}
async function testGetUserByApartmentID(apartmentId) {
    try {
        // Make a GET request to getUserByApartmentID route
        const response = await fetch(`http://localhost:63341/getUserByApartmentID/${apartmentId}`);

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error getting user by ApartmentID:', error);
    }
}

// Example usage:
testGetUserByApartmentID('65d70668db113ff7941f5831');




// Example usage:
// testMapUserToApartment('EyalCohen', '65d70668db113ff7941f5831');


// Example usage:
// testUpdateUser('EyalCohen', 'newPassword', 'newemail@example.com', '9876543210');



// Test deleting a picture
// testDeletePic(apartmentId, picId);

// Test updating apartment details
// testUpdateApartment(apartmentId, updatedDetails);

//WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW

// Call the testAddApartment function to execute the test
// testAddApartment();


// Call the testGetUser function to execute the test
// testGetUser();

// testAddImageToApartment();

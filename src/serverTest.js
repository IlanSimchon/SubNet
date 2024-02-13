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

// Call the testAddApartment function to execute the test
testAddApartment();


// Call the testGetUser function to execute the test
// testGetUser();

// testAddImageToApartment();

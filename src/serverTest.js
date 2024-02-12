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
        const response = await axios.get(`http://localhost:63341/getUser?userName=${userName}`);

        console.log(response.data); // Output the response from the server
    } catch (error) {
        console.error('Error:', error.response.data); // Output any errors that occurred
    }
}

// Call the testGetUser function to execute the test
testGetUser();

// testAddImageToApartment();

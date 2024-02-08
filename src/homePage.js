const apartment = document.getElementById('apartment');
const accountPage = document.getElementById('accountPage');
const savedApartments = document.getElementById('savedApartments');
const sort = document.getElementById('sort');
const filter = document.getElementById('filter');

async function displayApartments() {
    try {
        // Fetch apartments from the server
        const response = await fetch('http://localhost:63341/Apartments');
        const apartments = await response.json();

        // Check if there are any apartments
        if (apartments.length > 0) {
            // Get the container element where you want to display the apartments
            const container = document.querySelector('.container');

            // Loop through each apartment
            apartments.forEach(apartment => {
                // Create a div element for each apartment
                const apartmentBox = document.createElement('div');
                apartmentBox.classList.add('apartment-box');

                // Set the inner HTML content for the apartment box
                apartmentBox.innerHTML = `
                    <h3>Apartment ID: ${apartment._id}</h3>
                    <p>Location: ${apartment.location}</p>
                    <p>Price per Night: ${apartment.pricePerNight}</p>
                    <p>Availability: ${JSON.stringify(apartment.availability)}</p>
                    <p>Reviews: ${apartment.reviews.join(', ')}</p>
                    <p>Average Rate: ${apartment.avgRate}</p>
                    <p>Connection Details: ${apartment.connectionDetails}</p>
                    <img class="apartment-photo" src="back.jpg" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                    <hr>
                `;

                // Append the apartment box to the container
                container.appendChild(apartmentBox);
            });

            // Add event listener to the images
            container.querySelectorAll('.apartment-photo').forEach(apartmentPhoto => {
                apartmentPhoto.addEventListener('click', () => {
                    const apartmentId = apartmentPhoto.getAttribute('data-apartment-id');
                    displayApartmentDetails(apartmentId);
                });
            });
        } else {
            console.log('No apartments found. ' + apartments.length);
        }
    } catch (error) {
        console.error(error);
    }
}

async function displayApartmentDetails(apartmentId) {
    try {

        const response = await fetch(`http://localhost:63341/ApartmentByID/${apartmentId}`);
        const apartmentDetails = await response.json();

        const detailsHTML = `
            <div class="apartment">
                <img src="${apartmentDetails.photo}" alt="Apartment Image">
                <div class="details">
                    <h2>Location: ${apartmentDetails.location}</h2>
                    <p>Price Per Night: ${apartmentDetails.pricePerNight}</p>
                    <p>Availability: ${JSON.stringify(apartmentDetails.availability)}</p>
                    <p>Reviews: ${apartmentDetails.reviews.join(', ')}</p>
                    <p>Average Rate: ${apartmentDetails.avgRate}</p>
                    <p>Connection Details: ${apartmentDetails.connectionDetails}</p>
                </div>
            </div>
        `;

        const apartmentDetailsPage = window.open('', '_blank');
        apartmentDetailsPage.document.open();
        apartmentDetailsPage.document.write(`
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Apartment Details</title>
                    <link rel="stylesheet" href="apartment.css">
                </head>
                <body>
                    ${detailsHTML}
                </body>
            </html>
        `);
        apartmentDetailsPage.document.close();
    } catch (error) {
        console.error(error);
    }
}

// Run the function to display all apartments when the window is fully loaded
window.onload = displayApartments;





// document.addEventListener('DOMContentLoaded', function () {
//     apartment.addEventListener('click', () => {
//         // todo: method to display specific apartment
//
//     });
//     accountPage.addEventListener('click', () => {
//         // todo: method to move to account page
//     });
//     savedApartments.addEventListener('click', () => {
//         // todo: method to display only apartments i saved
//     });
//     sort.apartment.addEventListener('click', () => {
//         // todo: method to sort the apartments
//     });
//     filter.apartment.addEventListener('click', () => {
//         // todo: method to filter the apartments
//     });
//
// });
//


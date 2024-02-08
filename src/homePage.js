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
                    <img src="back.jpg" alt="Apartment Photo">
<!--                 <img src="${apartment.photo}" alt="Apartment Photo">-->
                    <hr>
                `;

                // Append the apartment box to the container
                container.appendChild(apartmentBox);
            });
        } else {
            console.log('No apartments found. ' + apartments.length);
        }
    } catch (error) {
        console.error(error);
    }
}

// Run the function when the window is fully loaded
window.onload = displayApartments;



// document.addEventListener('DOMContentLoaded', function () {
//     apartment.addEventListener('click', () => {
//         // todo: method to display specific apartment
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

// });



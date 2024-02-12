
// Class representing the apartment management functionality

import { Apartment } from './apartment.js';

class ApartmentManager {
    constructor() {
        // Retrieve user data from localStorage
        const userDataString = localStorage.getItem('userData');


        this.apartment = document.getElementById('apartment');
        this.login_house_owner = document.getElementById('login_house_owner');
        this.accountPage = document.getElementById('accountPage');
        this.savedApartments = document.getElementById('savedApartments');
        this.sort = document.getElementById('sort');
        this.filter = document.getElementById('filter');
        this.filterBar = document.getElementById('filter-bar');
        this.advancedFilterButton = document.getElementById('advancedFilterButton');

        // Event listeners
        this.filterBar.addEventListener('submit', this.applyFilters.bind(this));
        this.advancedFilterButton.addEventListener('click', this.addRatingFilter.bind(this));
        this.login_house_owner.addEventListener('click', ()=> window.location.href = 'house_owner.html');


        window.onload = this.displayApartments.bind(this);
    }


    addRatingFilter() {
        // Check if the rating input already exists
        if (!document.getElementById('rating')) {
            // Create label element for rating
            const ratingLabel = document.createElement('label');
            ratingLabel.setAttribute('for', 'rating');
            ratingLabel.textContent = 'Rating:';

            // Create input element for rating
            const ratingInput = document.createElement('input');
            ratingInput.setAttribute('type', 'number');
            ratingInput.setAttribute('id', 'rating');
            ratingInput.setAttribute('name', 'rating');
            ratingInput.setAttribute('min', '0');
            ratingInput.setAttribute('step', '0.1'); // Specify step attribute to allow decimal values

            // Insert the label and input before the buttons
            const filterForm = document.getElementById('filterForm');
            filterForm.insertBefore(ratingInput, filterForm.querySelector('button[type="submit"]'));
            filterForm.insertBefore(ratingLabel, ratingInput);

            this.closeAdvancedFilter();

        }

    }
    // Function to display all apartments
    async displayApartments() {
        try {
            const response = await fetch('http://localhost:63341/Apartments');
            const apartments = await response.json();

            if (apartments.length > 0) {
                const content = document.querySelector('.content');

                for (const apartment of apartments) {
                    // Fetch the apartment image URL
                    let imageUrl = `http://localhost:63341/getApartmentPic/${apartment._id}`;

                    // Check if the apartment has a picture
                    const imageResponse = await fetch(imageUrl);
                    if (!imageResponse.ok) {
                        // If there's no picture, use the generic house image
                        imageUrl = 'house.png';
                    }


                    const apartmentBox = document.createElement('div');
                    apartmentBox.classList.add('apartment-box');
                    const rateInPercent = 50 / 5 * apartment.avgRate
                    console.log(rateInPercent)
                    // Set the inner HTML content for the apartment box
                    apartmentBox.innerHTML = `
                        <p><i class='fas fa-map-marker-alt'></i> ${apartment.location}</p>
                        <p><i class="fas fa-sack-dollar"></i> ${apartment.pricePerNight} per night</p>
                        <p><i class="fa fa-calendar-alt"></i> ${JSON.stringify(apartment.availability)}</p>
                        ${generateStarRating(apartment.avgRate)}
                         <p><i class="fa fa-address-card"></i> ${apartment.connectionDetails}</p>
                        <img class="apartment-photo" src="${imageUrl}" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                        <hr>
                    `;

                    // Append the apartment box to the container
                    content.appendChild(apartmentBox);
                }

                // Add event listener to the entire apartment box
                content.querySelectorAll('.apartment-box').forEach(apartmentBox => {
                    apartmentBox.addEventListener('click', () => {
                        const apartmentId = apartmentBox.querySelector('.apartment-photo').getAttribute('data-apartment-id');
                        apartmentManager.displaySingleApartment(apartmentId);
                    });
                });

            } else {
                console.log('No apartments found. ' + apartments.length);
            }
        } catch (error) {
            console.error(error);
        }
    }


    // displays a single apartment in a new window
    async displaySingleApartment(apartmentId) {
        let single_apartment = null;
        // console.log(apartmentId);
        single_apartment = new Apartment(apartmentId);
        // console.log(single_apartment);
        single_apartment.getApartmentDetails();
    }


    // Function to render filtered apartments based on filter criteria
    async renderFilteredApartments(location, minPrice, maxPrice, rating) {
        try {
            const url = new URL('http://localhost:63341/Apartments');
            console.log("render fileted");
            const params = {
                location: location,
                minPrice: minPrice,
                maxPrice: maxPrice,
                rating: rating,
            };
            url.search = new URLSearchParams(params).toString();

            const response = await fetch(url.toString());
            const apartments = await response.json();

            // Filter apartments
            const filteredApartments = apartments.filter(apartment => {
                if (params.location && apartment.location.toLowerCase().indexOf(params.location.toLowerCase()) === -1) {
                    return false;
                }
                if (params.minPrice && apartment.pricePerNight < params.minPrice) {
                    return false;
                }
                if (params.maxPrice && apartment.pricePerNight > params.maxPrice) {
                    return false;
                }
                if (params.rating && apartment.avgRate < params.rating) {
                    return false;
                }
                return true;
            });

            // Get the container element where you want to display the apartments
            const content = document.querySelector('.content');
            content.innerHTML = ''; // Clear existing content

            if (filteredApartments.length > 0) {
                filteredApartments.forEach(apartment => {
                    // Create a div element for each apartment
                    const apartmentBox = document.createElement('div');
                    apartmentBox.classList.add('apartment-box');

                    // Set the inner HTML content for the apartment box
                    apartmentBox.innerHTML = `
                    <p><strong>Location:</strong> <p><strong>Location:</strong> ${apartment.location}</p>
                    <p><strong>Price per Night:</strong> ${apartment.pricePerNight}</p>
                    <p><strong>Availability:</strong> ${JSON.stringify(apartment.availability)}</p>
                    <p><strong>Average Rate:</strong> ${apartment.avgRate}</p>
                    <p><strong>Connection Details:</strong> ${apartment.connectionDetails}</p>
                    <img class="apartment-photo" src="back.jpg" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                    <hr>
                `;
                    // todo: change the html here to be with icons

                    // Append the apartment box to the container
                    content.appendChild(apartmentBox);
                });

                // Add event listener to the images
                content.querySelectorAll('.apartment-photo').forEach(apartmentPhoto => {
                    apartmentPhoto.addEventListener('click', () => {
                        const apartmentId = apartmentPhoto.getAttribute('data-apartment-id');
                        apartmentManager.displaySingleApartment(apartmentId);
                    });
                });
            } else {
                console.log('No apartments found. ' + apartments.length);
            }
        } catch (error) {
            console.error('Error fetching apartments with filters:', error);
        }
    }

    // Function to apply filters
    applyFilters(event) {
        event.preventDefault();
        const location = document.getElementById('location').value;
        console.log(location);
        const minPrice = parseFloat(document.getElementById('minPrice').value);
        const maxPrice = parseFloat(document.getElementById('maxPrice').value);
        let rating = 0; // Default rating value is 0

        // Check if the rating input element exists
        const ratingInput = document.getElementById('rating');
        if (ratingInput) {
            rating = parseFloat(ratingInput.value);
        }

        console.log(location);
        console.log(minPrice);
        console.log(maxPrice);
        console.log(rating);

        this.renderFilteredApartments(location, minPrice, maxPrice, rating);
    }

    closeAdvancedFilter() {
        this.advancedFilterButton.style.display = 'none';
    }
}

// Instantiate the ApartmentManager class
const apartmentManager = new ApartmentManager();


function generateStarRating(averageRate) {
    const maxStars = 5;
    const filledStars = Math.floor(averageRate); // Use floor to get the integer part
    const fractionalPart = averageRate - filledStars; // Get the fractional part
    let starRatingHTML = '<p>';

    for (let i = 1; i <= maxStars; i++) {
        if (i <= filledStars) {
            // Add a filled star
            starRatingHTML += '<i class="fas fa-star"></i>';
        } else if (i === filledStars + 1) {
            // Check the fractional part and add appropriate star
            if (fractionalPart < 0.3) {
                // Fraction is smaller than 0.3, make it zero
                starRatingHTML += '<i class="far fa-star"></i>';
            } else if (fractionalPart <= 0.8) {
                // Fraction is between 0.3 to 0.8, make it 0.5
                starRatingHTML += '<i class="fas fa-star-half-alt"></i>';
            } else {
                // Fraction is greater than 0.8, make it 1
                starRatingHTML += '<i class="fas fa-star"></i>';
            }
        } else {
            // Add an empty star
            starRatingHTML += '<i class="far fa-star"></i>';
        }
    }

    starRatingHTML += ` ${averageRate}</p>`;
    return starRatingHTML;
}



// convert a pic to the original format:
function convertBase64ToBlob(base64String) {
    try {
        // Extract image type and base64 data from the string
        const matches = base64String.match(/^data:(image\/([a-z]+));base64,(.+)$/);

        if (!matches || matches.length !== 4) {
            throw new Error('Invalid base64 image string');
        }

        const imageType = matches[2]; // Extracted image type (e.g., 'jpeg', 'png', etc.)
        const imageData = matches[3]; // Extracted base64 data

        // Convert base64 to binary data
        const binaryData = atob(imageData);

        // Create an ArrayBuffer with the length of the binary data
        const buffer = new ArrayBuffer(binaryData.length);

        // Create a view (typed array) to manipulate the buffer
        const view = new Uint8Array(buffer);

        // Populate the view with binary data
        for (let i = 0; i < binaryData.length; i++) {
            view[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob object representing the image
        const blob = new Blob([view], { type: 'image/${imageType}' });

        return blob;
    } catch (error) {
        console.error('Error converting base64 to Blob:', error);
        return null; // Return null in case of error
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contactLink = document.getElementById('contactLink');

    contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'contact.html';
    });
});

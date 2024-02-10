// Class representing the apartment management functionality
class ApartmentManager {
    constructor() {
        this.apartment = document.getElementById('apartment');
        this.accountPage = document.getElementById('accountPage');
        this.savedApartments = document.getElementById('savedApartments');
        this.sort = document.getElementById('sort');
        this.filter = document.getElementById('filter');
        this.filterBar = document.getElementById('filter-bar');
        this.advancedFilterButton = document.getElementById('advancedFilterButton');

        // Event listeners
        this.filterBar.addEventListener('submit', this.applyFilters.bind(this));
        this.advancedFilterButton.addEventListener('click', this.addRatingFilter.bind(this));


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

                apartments.forEach(apartment => {
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
                    content.appendChild(apartmentBox);
                });

                // Add event listener to the images
                content.querySelectorAll('.apartment-photo').forEach(apartmentPhoto => {
                    apartmentPhoto.addEventListener('click', () => {
                        const apartmentId = apartmentPhoto.getAttribute('data-apartment-id');
                        this.displayApartmentDetails(apartmentId);
                    });
                });
            } else {
                console.log('No apartments found. ' + apartments.length);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Function to display apartment details in a new window
    async displayApartmentDetails(apartmentId) {
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
                    content.appendChild(apartmentBox);
                });

                // Add event listener to the images
                content.querySelectorAll('.apartment-photo').forEach(apartmentPhoto => {
                    apartmentPhoto.addEventListener('click', () => {
                        const apartmentId = apartmentPhoto.getAttribute('data-apartment-id');
                        displayApartmentDetails(apartmentId);
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

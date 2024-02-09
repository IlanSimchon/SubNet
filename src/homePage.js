// Class representing the apartment management functionality
class ApartmentManager {
    constructor() {
        this.apartment = document.getElementById('apartment');
        this.accountPage = document.getElementById('accountPage');
        this.savedApartments = document.getElementById('savedApartments');
        this.sort = document.getElementById('sort');
        this.filter = document.getElementById('filter');
        this.menuButton = document.getElementById('menuButton');
        this.sidebar = document.getElementById('sidebar');
        this.advancedFilterButton = document.getElementById('advancedFilterButton'); // Add reference to the advanced filter button

        // this.advancedFilterButtons.addEventListener('click', this.toggleSidebar.bind(this)); // Add event listener for advanced filter button

        // Add event listeners
        // this.menuButton.addEventListener('mouseenter', this.openSidebar.bind(this));
        this.sidebar.addEventListener('submit', this.applyFilters.bind(this));
        this.advancedFilterButton.addEventListener('click', this.addRatingFilter.bind(this));

        // Add event listeners
        // this.menuButton.addEventListener('mouseenter', this.openSidebar.bind(this));

        window.onload = this.displayApartments.bind(this);
    }


    addRatingFilter() {
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
    }
    // Other methods...


    // Function to display all apartments
    async displayApartments() {
        try {
            // Fetch apartments from the server
            const response = await fetch('http://localhost:63341/Apartments');
            const apartments = await response.json();

            // Check if there are any apartments
            if (apartments.length > 0) {
                // Get the container element where you want to display the apartments
                const content = document.querySelector('.content');

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
    async renderFilteredApartments(location, minPrice, maxPricem, rating) {
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

            // Filter apartments based on the filter criteria
            const filteredApartments = apartments.filter(apartment => {
                // Apply location filter
                if (params.location && apartment.location.toLowerCase().indexOf(params.location.toLowerCase()) === -1) {
                    return false;
                }
                // Apply minimum price filter
                if (params.minPrice && apartment.pricePerNight < params.minPrice) {
                    return false;
                }
                // Apply maximum price filter
                if (params.maxPrice && apartment.pricePerNight > params.maxPrice) {
                    return false;
                }
                // Apply rating filter
                if (params.rating && apartment.avgRate < params.rating) {
                    return false;
                }
                return true;
            });


            console.log(filteredApartments);


            // Get the container element where you want to display the apartments
            const content = document.querySelector('.content');
            content.innerHTML = ''; // Clear existing content

            // Check if there are any apartments
            if (filteredApartments.length > 0) {
                // Loop through each apartment
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
        const minPrice = parseFloat(document.getElementById('minPrice').value);
        const maxPrice = parseFloat(document.getElementById('maxPrice').value);
        const rating = parseFloat(document.getElementById('rating').value);

        console.log(location);
        console.log(minPrice);
        console.log(maxPrice);
        console.log(rating);

        // console.log(location);
        // // Call a function to fetch apartments based on the provided filters
        this.renderFilteredApartments(location, minPrice, maxPrice, rating);
    }

    // Function to apply filters and fetch data

    // Function to fetch apartments based on filters


    // Function to open the sidebar menu
    openSidebar() {
        this.sidebar.style.width = '250px'; // Set sidebar width to show menu
        this.menuButton.style.display = 'none'; // Hide menu button
    }

    // Function to close the sidebar menu
    closeSidebar() {
        this.sidebar.style.width = '0'; // Set sidebar width to hide menu
        this.menuButton.style.display = 'block'; // Show menu button
    }
}

// Instantiate the ApartmentManager class
const apartmentManager = new ApartmentManager();

class house_owner {
    constructor() {
        document.addEventListener('DOMContentLoaded', this.displayApartments.bind(this));
    }
    
    async displayApartments() {
        const userDataString = localStorage.getItem('userData');
        this.userData = JSON.parse(userDataString).user;
        const userNameValue = this.userData.userName;
        console.log(userNameValue);

        try {
            const response = await fetch(`http://localhost:63341/Apartments?userName=${userNameValue}`);
            const apartments = await response.json();
            console.log(apartments.length)
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
                        apartmentManager.displayApartmentDetails(apartmentId);
                    });
                });

            } else {
                console.log('No apartments found. ' + apartments.length);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

// Create an instance of the house_owner class
const owner = new house_owner();


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

// Add an apartment
document.addEventListener('DOMContentLoaded', () => {
    const addApartmenDetailstBtn = document.getElementById('addApartmenDetailstBtn');
    addApartmenDetailstBtn.addEventListener('click', openAddApartmentTab);

    async function openAddApartmentTab() {
        const addApartmentFormContainer = document.getElementById('addApartmentFormContainer');
        addApartmentFormContainer.style.display = (addApartmentFormContainer.style.display === 'none') ? 'block' : 'none';

        const addApartmentForm = document.getElementById('addApartmentForm');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        // Additional elements
        const apartmentDetailsContainer = document.getElementById('apartmentDetailsContainer');
        const apartmentDetails = document.getElementById('apartmentDetails');
        const confirmApartmentBtn = document.getElementById('confirmApartmentBtn');

        addApartmentForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const locationInput = document.getElementById('locationInput');
            const priceInput = document.getElementById('priceInput');
            const startDateInput = document.getElementById('startDateInput');
            const endDateInput = document.getElementById('endDateInput');
            const photoInput = document.getElementById('photoInput');

            const currentUser = await getCurrentUser();

            if (currentUser) {
                const formData = new FormData();
                formData.append('location', locationInput.value);
                formData.append('pricePerNight', priceInput.value);
                formData.append('availability', JSON.stringify({ startDate: startDateInput.value, endDate: endDateInput.value }));
                formData.append('photo', photoInput.files[0]); // Assuming you want to upload the first selected file
                formData.append('avgRate', '0');
                formData.append('owner', currentUser.name);
                formData.append('connectionDetails', JSON.stringify({ email: currentUser.email, phone: currentUser.phone }));
                formData.append('reviews', '[]');

                try {
                    const response = await fetch('http://localhost:63341/addApartment', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error}`);
                    }

                    // Clear input fields
                    locationInput.value = '';
                    priceInput.value = '';
                    startDateInput.value = '';
                    endDateInput.value = '';
                    photoInput.value = '';

                    // Display success message
                    successMessage.textContent = 'Apartment added successfully!';
                    errorMessage.textContent = ''; // Clear any previous error message

                } catch (error) {
                    console.error('Error adding apartment:', error.message);

                    // Display error message
                    errorMessage.textContent = `Error adding apartment: ${error.message}`;
                    successMessage.textContent = ''; // Clear any previous success message
                }
            } else {
                console.error('Could not fetch current user details.');

                // Display error message
                errorMessage.textContent = 'Could not fetch current user details.';
                successMessage.textContent = ''; // Clear any previous success message
            }
            // Display apartment details for confirmation
            apartmentDetails.innerHTML = `
                <p><strong>Location:</strong> ${locationInput.value}</p>
                <p><strong>Price Per Night:</strong> ${priceInput.value}</p>
                <p><strong>Availability:</strong> ${startDateInput.value} to ${endDateInput.value}</p>
                <!-- Add other details here -->
                `;

                // Show the apartment details container
            addApartmentFormContainer.style.display = 'none';
            apartmentDetailsContainer.style.display = 'block';
        });
        // Event listener for confirming apartment details
        confirmApartmentBtn.addEventListener('click', async () => {
            // ... (existing code for submitting the form)

            // Hide the details container after confirmation
            apartmentDetailsContainer.style.display = 'none';
});
    }


    // Function to get current user details from the server
    async function getCurrentUser() {
        try {
            const response = await fetch('http://localhost:63341/getCurrentUser');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching current user:', error.message);
            return null;
        }
    }
});

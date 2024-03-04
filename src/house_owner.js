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
                         <p><i class='fas fa-check-circle'> Is Booked: </i> ${apartment.isAvailable}</p> 
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


            const currentUserName = await getCurrentUser();
            // Make a GET request to the getUser endpoint with the userName as a query parameter

            let startD;
            if (currentUserName) {
                try {
                    const response = await fetch(`http://localhost:63341/getUser?userName=${currentUserName}`);

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const userData = await response.json();

                    console.log(userData);


                    let startD = startDateInput.value;
                    let endD = endDateInput.value
                    let apartmentID = await AddApartment(
                        locationInput.value,
                        parseFloat(priceInput.value),
                        {
                            startDate: startD,
                            endDate: endD
                        },
                        currentUserName,
                        userData.email + ", " + userData.phone,
                        [],
                        0
                    );
                    console.log("apartmentID: " + apartmentID);
                    console.log("photo path: " + photoInput.value); //todo: fix the photo path! ("fake path")


                    // Send POST request to addImageToApartment endpoint with apartment ID and image path
                    const addImageResponse = await fetch('http://localhost:63341/addImageToApartment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            apartmentId: apartmentID,
                            imagePath: photoInput.value
                        })
                    });

                    if (!addImageResponse.ok) {
                        throw new Error('Failed to add image to apartment');
                    }
                    refreshPage();

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


    // Function to get current username
    async function getCurrentUser() {
        try {
            // Retrieve user data from localStorage
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
                // Parse the user data JSON string
                const userData = JSON.parse(userDataString);
                // Return the user's name
                return userData.user.userName;
            } else {
                console.error('User data not found in localStorage');
                return null;
            }
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

});


async function AddApartment(location, pricePerNight, availability, owner, connectionDetails, reviews, avgRate) {
    try {
        const apartmentData = {
            location,
            pricePerNight,
            availability,
            owner,
            connectionDetails,
            reviews,
            avgRate
        };

        const addApartmentResponse = await fetch('http://localhost:63341/addApartment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(apartmentData),
        });

        if (!addApartmentResponse.ok) {
            const errorData = await addApartmentResponse.json();
            throw new Error(`HTTP error! Status: ${addApartmentResponse.status}, Message: ${errorData.error}`);
        }

        // Extract the added apartment ID from the response
        const addedApartmentId = await addApartmentResponse.json();

        // Return the added apartment ID as a string
        return addedApartmentId;

    } catch (error) {
        console.error('Error:', error.message); // Output any errors that occurred
    }
}


function refreshPage() {
    window.location.reload();
}


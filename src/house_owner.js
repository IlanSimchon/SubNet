const addApartmentFormContainer = document.getElementById('addApartmentFormContainer');

class house_owner {
    constructor() {
        document.addEventListener('DOMContentLoaded', this.displayApartments.bind(this));

        const filterByBookedBtn = document.getElementById('filterByBookedBtn');
        const filterByAvailableBtn = document.getElementById('filterByAvailableBtn');

        const userDataString = localStorage.getItem('userData');
        this.userData = JSON.parse(userDataString).user;
        const userNameValue = this.userData.userName;
        console.log(userNameValue);

        filterByBookedBtn.addEventListener('click', () => this.filterApartments(true, userNameValue));
        filterByAvailableBtn.addEventListener('click', () => this.filterApartments(false, userNameValue));
    }

    async filterApartments(isBooked, userNameValue) {
        const content = document.querySelector('.content');
        content.innerHTML = '';

        try {
            const response = await fetch(`http://localhost:63341/Apartments?userName=${userNameValue}`);
            const apartments = await response.json();

            const filteredApartments = apartments.filter(apartment => apartment.isBooked === isBooked);

            if (filteredApartments.length > 0) {
                for (const apartment of filteredApartments) {
                    const imageUrl = `http://localhost:63341/getApartmentPic/${apartment._id}`;
                    const imageResponse = await fetch(imageUrl);
                    const imageUrlToShow = imageResponse.ok ? imageUrl : 'house.png';

                    const apartmentBox = document.createElement('div');
                    apartmentBox.classList.add('apartment-box');

                    apartmentBox.innerHTML = `
                        <p><i class='fas fa-map-marker-alt'></i> ${apartment.location}</p>
                        <p><i class="fas fa-sack-dollar"></i> ${apartment.pricePerNight} per night</p>
                        <p><i class="fa fa-calendar-alt"></i> ${JSON.stringify(apartment.availability)}</p>
                        ${generateStarRating(apartment.avgRate)}
                        <p><i class="fa fa-address-card"></i> ${apartment.connectionDetails}</p>
                        <p><i class='fas fa-check-circle'> Is Booked: </i> ${apartment.isBooked}</p> 
                        <img class="apartment-photo" src="${imageUrlToShow}" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                        <hr>
                    `;

                    content.appendChild(apartmentBox);
                }
            } else {
                console.log(`No ${isBooked ? 'booked' : 'available'} apartments found.`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Function to format the availability dates
    formatAvailabilityDate(availability) {
        const startDate = new Date(availability.startDate);
        const endDate = new Date(availability.endDate);

        // Format start date
        const startDay = startDate.getDate().toString().padStart(2, '0');
        const startMonth = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const startYear = startDate.getFullYear();

        // Format end date
        const endDay = endDate.getDate().toString().padStart(2, '0');
        const endMonth = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const endYear = endDate.getFullYear();

        return `${startDay}.${startMonth}.${startYear} - ${endDay}.${endMonth}.${endYear}`;
    }

    async displayApartments() {
        const userDataString = localStorage.getItem('userData');
        this.userData = JSON.parse(userDataString).user;
        const userNameValue = this.userData.userName;
        console.log(userNameValue);

        try {
            const response = await fetch(`http://localhost:63341/Apartments?userName=${userNameValue}`);
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

                    const availability = this.formatAvailabilityDate(apartment.availability);

                    const apartmentBox = document.createElement('div');
                    apartmentBox.classList.add('apartment-box');
                    const rateInPercent = 50 / 5 * apartment.avgRate
                    const isBooked = (apartment.isBooked === true) ?  'Booked' : 'Available';                    console.log(apartment.isBooked)
                    console.log(isBooked)


                    // Set the inner HTML content for the apartment box
                    apartmentBox.innerHTML = `
                        <img class="apartment-photo" src="${imageUrl}" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                        <p><i class='fas fa-map-marker-alt'></i> ${apartment.location}</p>
                        <p><i class="fas fa-sack-dollar"></i> ${apartment.pricePerNight} per night</p>
                        <p><i class="fa fa-calendar-alt"></i> ${availability}</p>
                        ${generateStarRating(apartment.avgRate)}
                        <p><i class="fa fa-address-card"></i> ${apartment.connectionDetails}</p>
                        <p><i id="bookedStatus" class='fas fa-check-circle ${apartment.isBooked === true ? 'booked' : 'available'}'> ${isBooked}</i></p>
                        <button class="delete-button" data-apartment-id="${apartment._id}"><i class="fas fa-trash"></i> Delete</button>

                        <div id="clientDetailsModal" class="modal">
                          <div class="modal-content">
                            <!-- Client details go here -->
                            <p>Client Details:</p>
                            <!-- Add more details as needed -->
                            <button id="close"><span class="close">&times;</span></button>
                          </div>
                        </div>
                                                   
                            <hr>
                    `;


                    const bookedStatus = apartmentBox.querySelector('#bookedStatus');
                    const modal = apartmentBox.querySelector('#clientDetailsModal');
                    const closeModal = apartmentBox.querySelector('#close');

                    // Add click event listener to the "Booked" text
                    bookedStatus.addEventListener('click', async () => {
                        const status = bookedStatus.textContent.trim().toLowerCase();
                        console.log(status);
                        if(status === 'booked') {
                            const apartmentID = apartment._id
                            try {
                                // Make a GET request to getUserByApartmentID route
                                const response = await fetch(`http://localhost:63341/getUserByApartmentID/${apartmentID}`);

                                const data = await response.json();
                                console.log(data);
                                if (data) {
                                    // Update modal content with user details
                                    const modalContent = modal.querySelector('.modal-content');
                                    modalContent.innerHTML = `
                                <p id="modal-title">Client Details:</p>
                                <p id="userName">User Name: ${data.user.userName}</p>
                                <p id="Phone">Phone: ${data.user.phone}</p>
                                <span class="close">&times;</span>
        `;
                                }
                            } catch (error) {
                                console.error('Error getting user by ApartmentID:', error);
                            }
                            // Display the modal
                            modal.style.display = 'block';
                        }
                        });

                    // Add click event listener to close the modal
                    closeModal.addEventListener('click', () => {
                        // Hide the modal
                        console.log("inside!")
                        modal.style.display = 'none';
                    });

                    // Close the modal if the user clicks outside of it
                    window.addEventListener('click', (event) => {
                        if (event.target === modal) {
                            modal.style.display = 'none';
                        }
                    });



                    // Append the apartment box to the container
                    content.appendChild(apartmentBox);
                }

// Assuming you have the apartments container with the class "content"
                const apartmentsContainer = document.querySelector('.content');
                console.log(apartmentsContainer);

                apartmentsContainer.addEventListener('click', async function (event) {
                    if (event.target.classList.contains('delete-button')) {
                        const apartmentId = event.target.dataset.apartmentId;
                        console.log(apartmentId)
                        try {
                            // Call the server to delete the apartment
                            const response = await fetch(`http://localhost:63341/deleteApartment/${apartmentId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (response.ok) {
                                // Apartment deleted successfully
                                console.log(`Apartment with ID ${apartmentId} deleted`);
                                // Optionally, remove the apartment box from the UI
                                const apartmentBox = event.target.closest('.apartment-box');
                                if (apartmentBox) {
                                    apartmentBox.remove();
                                }
                            } else {
                                // Handle error response from the server
                                const errorData = await response.json();
                                console.error(`Error deleting apartment: ${errorData.error}`);
                            }
                        } catch (error) {
                            console.error('Error deleting apartment:', error.message);
                        }
                    }
                });

                // Add event listener to the entire apartment box
                // content.querySelectorAll('.apartment-box').forEach(apartmentBox => {
                //     apartmentBox.addEventListener('click', () => {
                //         const apartmentId = apartmentBox.querySelector('.apartment-photo').getAttribute('data-apartment-id');
                //         Apart.displayApartmentDetails(apartmentId);
                //     });
                // });

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


async function openAddApartmentTab() {
    if (addApartmentFormContainer.style.display === 'none') {
        addApartmentFormContainer.style.display = 'block';
    }
    else {
        addApartmentFormContainer.style.display = 'none';
        return
    }

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

// Add an apartment
document.addEventListener('DOMContentLoaded', () => {
    const addApartmenDetailstBtn = document.getElementById('addApartmenDetailstBtn');
    addApartmenDetailstBtn.addEventListener('click', openAddApartmentTab);

    const closeAddApartmentForm = document.getElementById('closeFormBtn');
    closeAddApartmentForm.addEventListener('click', () => {
        addApartmentFormContainer.style.display = 'none';
    });

    const showAllButton = document.getElementById('showAll');
    showAllButton.addEventListener('click', () => {
        window.location.href = 'house_owner.html';
    });
});

    // Function to get current username
    // async function getCurrentUser() {
    //     try {
    //         // Retrieve user data from localStorage
    //         const userDataString = localStorage.getItem('userData');
    //         if (userDataString) {
    //             // Parse the user data JSON string
    //             const userData = JSON.parse(userDataString);
    //             // Return the user's name
    //             return userData.user.userName;
    //         } else {
    //             console.error('User data not found in localStorage');
    //             return null;
    //         }
    //     } catch (error) {
    //         console.error('Error getting current user:', error);
    //         return null;
    //     }
    // }


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



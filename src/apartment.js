export class Apartment {
    constructor(apartmentId) {
        // Initialize apartment ID
        this.apartmentId = apartmentId;

        // Call getApartmentDetails method with the apartmentId
        this.getApartmentDetails();
    }

    async getApartmentDetails() {
        try {
            // Fetch apartment details from the server using apartmentId
            const response = await fetch(`http://localhost:63341/ApartmentByID/${this.apartmentId}`);
            const apartmentDetails = await response.json();

            // Call a method to display apartment details
            this.displayApartmentDetails(apartmentDetails);
        } catch (error) {
            console.error('Error fetching apartment details:', error);
        }
    }

    async fetchApartmentImage() {
        try {
            // Fetch the apartment image using the apartmentId
            const response = await fetch(`http://localhost:63341/getApartmentPic/${this.apartmentId}`);

            if (response.ok) {
                // If the request is successful, return the URL of the apartment image
                return response.url;
            } else {
                // If there's no picture available, return the URL of a default image
                return 'house.png';
            }
        } catch (error) {
            console.error('Error fetching apartment image:', error);
            // Return the URL of a default image in case of an error
            return 'house.png';
        }
    }

    async displayApartmentDetails(apartmentDetails) {
        try {
            const imageUrl = await this.fetchApartmentImage();
            const queryParams = new URLSearchParams({
                location: apartmentDetails.location,
                pricePerNight: apartmentDetails.pricePerNight,
                availability: JSON.stringify(apartmentDetails.availability),
                reviews: apartmentDetails.reviews,
                avgRate: apartmentDetails.avgRate,
                photo: imageUrl,
                connectionDetails: apartmentDetails.connectionDetails,
                apartmentId: this.apartmentId,
                isBooked: apartmentDetails.isBooked
            });


            // Redirect to apartment.html with query parameters, including apartmentId
            window.location.href = `apartment.html?${queryParams.toString()}`;
        } catch (error) {
            console.error('Error displaying apartment details:', error);
        }

    }

    toggleLikeButtonColor(likeBtn) {
        likeBtn.classList.toggle('likeBtn-white');
        likeBtn.classList.toggle('likeBtn-red');
    }
}

// Function to parse URL parameters
export function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

// Get the URL parameters
export const params = getUrlParams();

// Function to be executed on page load
export function onPageLoad() {
    const params = getUrlParams();


    // Parse availability dates// Parse availability dates
    const availability = JSON.parse(params['availability']);
    const startDate = new Date(availability.startDate);
    const endDate = new Date(availability.endDate);

    // Format dates
    const formattedStartDate = `${startDate.getDate()}.${startDate.getMonth() + 1}.${startDate.getFullYear()}`;
    const formattedEndDate = `${endDate.getDate()}.${endDate.getMonth() + 1}.${endDate.getFullYear()}`;

    // Display apartment details with icons
    const apartmentDetailsContainer = document.getElementById('apartment_details');
    apartmentDetailsContainer.innerHTML = `
        <h2><i class="fas fa-map-marker-alt"></i> Location: ${params['location']}</h2>
        <p><i class="fas fa-sack-dollar"></i> Price Per Night: ${params['pricePerNight']}</p>
        <p><i class="far fa-calendar-alt"></i> Availability: ${formattedStartDate} - ${formattedEndDate}</p>
        <p><i class="far fa-star"></i> Reviews: ${params['reviews']}</p>
        <p><i class="fas fa-star"></i> Average Rate: ${params['avgRate']}</p>
        <p><i class="far fa-address-card"></i> Owner Connection Details: ${params['connectionDetails']}</p>
        
        <button id="likeBtn" class="likeBtn-white"><i class="fas fa-heart"></i> Like</button>
        <div id="buttonContainer"></div>
        <button id="recommendBtn">Recommend</button>

    `;

    // Set the image source to the fetched image URL
    const apartmentImage = document.getElementById('apartment_image');
    apartmentImage.src = params['photo']; // Assuming 'photo' is the parameter containing the image URL

    // Get the button container
    const buttonContainer = document.getElementById('buttonContainer');

    // Check if the apartment is booked
    const isBooked = params['isBooked'] === 'true';
    // Create either reserveBtn or cancelBtn based on the isBooked status
    const reserveOrCancelBtn = isBooked ? createCancelBtn() : createReserveBtn();

    // Append the button to the container
    buttonContainer.appendChild(reserveOrCancelBtn);

    // like button
    const likeBtn = document.getElementById('likeBtn');
    likeBtn.addEventListener('click', async () => {
        console.log("you liked this apartment!");
        const apartmentId = params['apartmentId'];
        const username = await getCurrentUsername();
        console.log(username, apartmentId);
        await addOrRemoveApartment(username, apartmentId);            
    });   
}

// Function to add or remove an apartment from a user's liked apartments
async function addOrRemoveApartment(userId, apartmentId) {
    try {
        // Check if the combination already exists
        const checkResponse = await fetch(`http://localhost:63341/likedApartments/${userId}`);
        const existingLikedApartments = await checkResponse.json();

        const userIdExists = existingLikedApartments.some(record => record.apartmentId === apartmentId);

        if (userIdExists) {
            // The combination already exists, remove it
            await removeApartmentFromLiked(userId, apartmentId);
            alert('Apartment removed from wish list');
        } else {
            // The combination doesn't exist, add it
            await addApartmentToLiked(userId, apartmentId);
            alert('Apartment added to wish list');
        }
    } catch (error) {
        console.error('Error checking or updating liked apartments:', error);
    }
}


// Function to add an apartment to a user's liked apartments
async function addApartmentToLiked(userId, apartmentId) {
    try {
        // Make a POST request to the server to add the apartment to liked apartments
        const response = await fetch('http://localhost:63341/likeApartment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, apartmentId })
        });

        const data = await response.json();
        console.log(data.message); // Output success message
    } catch (error) {
        console.error('Error adding apartment to liked apartments:', error);
    }
}

// Function to remove an apartment from a user's liked apartments
async function removeApartmentFromLiked(userId, apartmentId) {
    try {
        // Make a DELETE request to the server to remove the apartment from liked apartments
        const response = await fetch(`http://localhost:63341/likeApartment?userId=${userId}&apartmentId=${apartmentId}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        console.log(data.message); // Output success message
    } catch (error) {
        console.error('Error removing apartment from liked apartments:', error);
    }
}

async function getCurrentUsername() {
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

// Function to create a reserve button
function createReserveBtn() {
    console.log('created reserve buttn');
    const reserveBtn = document.createElement('button');
    reserveBtn.id = 'reserveBtn';
    reserveBtn.textContent = 'Reserve Apartment';
    return reserveBtn;
}

// Function to create a cancel reservation button
function createCancelBtn() {
    console.log('created cancel buttn');
    const cancelResBtn = document.createElement('button');
    cancelResBtn.id = 'cancelResBtn';
    cancelResBtn.textContent = 'Cancel Reservation';
    return cancelResBtn;
}

// Function to create a recommendation box
function createRecommendationBox() {
    const recommendationBox = document.createElement('div');
    recommendationBox.id = 'recommendationBox';
    recommendationBox.classList.add('recommendation-box');
    recommendationBox.style.display = 'none';

    recommendationBox.innerHTML = `
        <span class="close" id="closeRecommendationBox">&times;</span>
        <h2>Recommendation</h2>
        <label for="rating">Rating (1-5):</label>
        <input type="number" id="rating" name="rating" min="1" max="5" required>
        <label for="review">Review:</label>
        <textarea id="review" name="review" rows="4" cols="50" placeholder="Write your review..." required></textarea>
        <button id="submitRecommendation">Submit</button>
    `;

    document.body.appendChild(recommendationBox);

    const closeRecommendationBox = document.getElementById('closeRecommendationBox');
    closeRecommendationBox.addEventListener('click', () => {
        recommendationBox.style.display = 'none';
    });

    return recommendationBox;
}

// -------- Wish List--------------
/*function addToWishList(apartmentDetails) {
    const likedApartmentsList = document.getElementById('likedApartments');
    const apartmentItem = document.createElement('li');
    apartmentItem.textContent = apartmentDetails;
    likedApartmentsList.appendChild(apartmentItem);
}

async function getApartmentDetails() {
    try {
        // Fetch apartment details from the server using apartmentId
        const response = await fetch(`http://localhost:63341/ApartmentByID/${this.apartmentId}`);
        const apartmentDetails = await response.json();

        // Call a method to display apartment details
        this.displayApartmentDetails(apartmentDetails);
    } catch (error) {
        console.error('Error fetching apartment details:', error);
    }
}

document.getElementById('likeBtn').addEventListener('click', function () {
    const apartmentName = getApartmentDetails();
    
    // Assuming updateLikedApartmentsList is defined in this file
    updateLikedApartmentsList(apartmentName);

    // Send a request to the server to like the apartment
    fetch(`http://localhost:63341/likeApartment?apartmentName=${apartmentName}`, {
        method: 'POST',
        // Add headers if needed
        // body: JSON.stringify({  }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Apartment liked:', data);
        // You can update UI or provide feedback to the user
    })
    .catch(error => console.error('Error liking apartment:', error));
});*/



// -------- Add review and rank----------
// Function to create an approvement box
function createReservationApprovedBox() {
    const approvementBox = document.createElement('div');
    approvementBox.id = 'approvementBox';
    approvementBox.classList.add('approvementBox-box');
    approvementBox.style.display = 'none';

    approvementBox.innerHTML = `
        <span class="close" id="closeReserveApprovementBox">&times;</span>
        <h2>Reservation Approved!</h2>
        <p>Thank you for choosing us<br>
        Enjoy your stay!</p>
    `;

    document.body.appendChild(approvementBox);

    const closeReserveApprovementBox = document.getElementById('closeReserveApprovementBox');
    closeReserveApprovementBox.addEventListener('click', () => {
        approvementBox.style.display = 'none';
    });

    return approvementBox;
}

// Function to create an cancelation box
function createReservationCancelationBox() {
    const cancelationBox = document.createElement('div');
    cancelationBox.id = 'approvementBox';
    cancelationBox.classList.add('cancelationBox-box');
    cancelationBox.style.display = 'none';

    cancelationBox.innerHTML = `
        <span class="close" id="closeCancelationBox">&times;</span>
        <h2>Reservation Is Cancelled</h2>
        <p>Sorry it was not your match,<br>
        Maybe next time..</p>
    `;

    document.body.appendChild(approvementBox);
    document.body.appendChild(cancelationBox);

    const closeCancelationBox = document.getElementById('closeCancelationBox');
    closeCancelationBox.addEventListener('click', () => {
        cancelationBox.style.display = 'none';
    });

    return cancelationBox;
}


document.addEventListener('DOMContentLoaded', () => {
    onPageLoad();

    const recommendBtn = document.getElementById('recommendBtn');
    const recommendationBox = createRecommendationBox();
    const ratingInput = document.getElementById('rating');
    const reviewInput = document.getElementById('review');
    const errorBox = document.createElement('div');
    const buttonContainer = document.getElementById('buttonContainer');
    const reserveBtn = document.getElementById('reserveBtn');
    const approvementBox = createReservationApprovedBox();
    const cancelationBox = createReservationCancelationBox();

    errorBox.id = 'errorBox'; // Add an ID to the error box for easier manipulation

    recommendBtn.addEventListener('click', () => {
        recommendationBox.style.display = 'block';
        errorBox.style.display = 'none'; // Hide error message when opening the box
    });

    reserveBtn.addEventListener('click', async () => {
        try {
            const apartmentId = params['apartmentId'];

            const response = await fetch(`http://localhost:63341/ApartmentByID/${apartmentId}`);
            const apartmentDetails = await response.json();

            const updatedIsBooked = true;

            // Send a PATCH request to update the isBooked property
            const updateResponse = await fetch(`http://localhost:63341/updateApartment/${apartmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isBooked: updatedIsBooked,
                }),
            });

            if (updateResponse.ok) {
                console.log('Apartment reservation status updated successfully');
                approvementBox.style.display = 'block';
                errorBox.style.display = 'none';
            
                // Hide the reserveBtn and show the cancelResBtn
                reserveBtn.style.display = 'none';
                const cancelResBtn = createCancelBtn();
                buttonContainer.appendChild(cancelResBtn);
                } else {
                    console.error('Failed to update apartment reservation status');
                }
        } catch (error) {
            console.error('Error updating apartment reservation status:', error);
        }
    });

    // Add event listener for Cancel Reservation button
    document.addEventListener('click', async (event) => {
        if (event.target.id === 'cancelResBtn') {
            try {
                const apartmentId = params['apartmentId'];

                const response = await fetch(`http://localhost:63341/ApartmentByID/${apartmentId}`);
                const apartmentDetails = await response.json();

                const updatedIsBooked = false;

                // Send a PATCH request to update the isBooked property
                const updateResponse = await fetch(`http://localhost:63341/updateApartment/${apartmentId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        isBooked: updatedIsBooked,
                    }),
                });

                if (updateResponse.ok) {
                    console.log('Apartment reservation status updated successfully');
                    cancelationBox.style.display = 'block';
                    errorBox.style.display = 'none';

                    // Replace cancelResBtn with reserveBtn
                    const cancelResBtn = document.getElementById('cancelResBtn');
                    cancelResBtn.remove();
                    reserveBtn.style.display = 'block';
                } else {
                    console.error('Failed to update apartment reservation status');
                }
            } catch (error) {
                console.error('Error updating apartment reservation status:', error);
            }
        }
    });

    const submitRecommendationBtn = document.getElementById('submitRecommendation');

    submitRecommendationBtn.addEventListener('click', async () => {
        try {
            const rating = ratingInput.value;
            const review = reviewInput.value;

            // Check if both rating and review are filled
            if (!rating || !review) {
                showError("Please fill both the rating and review");
                return;
            }

            // Check if rating is in the range 1-5
            if (rating < 1 || rating > 5) {
                showError("Rating must be between 1 and 5");
                return;
            }

            // Assuming you have the apartment ID stored in a variable 'apartmentId'
            const apartmentId = params['apartmentId']

            // Fetch the apartment details
            const response = await fetch(`http://localhost:63341/ApartmentByID/${apartmentId}`);
            const apartmentDetails = await response.json();

            // Calculate the new average rating
            const currentAvgRate = apartmentDetails.avgRate || 0;
            const totalReviews = apartmentDetails.reviews?.length || 0;
            const newAvgRate = ((currentAvgRate * totalReviews) + parseFloat(rating)) / (totalReviews + 1);

            // Update the apartment with the new average rating and add the review
            const updateResponse = await fetch(`http://localhost:63341/updateApartmentAvgNReviews/${apartmentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    avgRate: newAvgRate,
                    review: review,
                }),
            });

            if (updateResponse.ok) {
                console.log('Recommendation submitted successfully');
                // Optionally update the UI to reflect the changes
            } else {
                console.error('Failed to submit recommendation');
            }

            // Close the recommendation box
            recommendationBox.style.display = 'none';
        }
        catch (error) {
            console.error('Error submitting recommendation:', error);
        }
    });

    function showError(message) {
        errorBox.textContent = message;

        // Add one-row class to make the error message one row
        errorBox.classList.add('one-row');

        // Append errorBox to recommendationBox
        recommendationBox.appendChild(errorBox);

        // Show the error box
        errorBox.style.display = 'block';
    }
});
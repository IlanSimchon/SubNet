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
            });

            // Redirect to apartment.html with query parameters, including apartmentId
            window.location.href = `apartment.html?${queryParams.toString()}`;
        } catch (error) {
            console.error('Error displaying apartment details:', error);
        }

        const likeBtn = document.getElementById('likeBtn');
        likeBtn.addEventListener('click', () => {
            this.addToWishList(apartmentDetails);
            this.toggleLikeButtonColor(likeBtn);
        });
    }

    // Function to display reservation approved message
    showReservationApprovedMessage() {
        // Create a popup window
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close" onclick="this.parentElement.style.display='none'">&times;</span>
                <p>Reservation Approved! <br>
                Enjoy your stay!</p>
            </div>
        `;
        document.body.appendChild(popup);
    }

    toggleLikeButtonColor(likeBtn) {
        likeBtn.classList.toggle('likeBtn-white');
        likeBtn.classList.toggle('likeBtn-red');
    }

    // Add this function to apartment.js
    async addToWishList(apartmentDetails) {
        try {
            // Fetch user ID or any identifier for the current user from localStorage or your authentication mechanism
            const userId = getUserId(); // Implement this function

            // Send a request to the server to add the apartment to the user's wish list
            const response = await fetch(`http://localhost:63341/addToWishList/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ apartmentDetails }),
            });

            if (response.ok) {
                console.log('Apartment added to wish list successfully');
                // Optionally update the wish list in localStorage if you want to keep it client-side
                // const updatedWishList = [...getWishList(), apartmentDetails.location];
                // localStorage.setItem('wishList', JSON.stringify(updatedWishList));
            } else {
                console.error('Failed to add apartment to wish list');
            }
        } catch (error) {
            console.error('Error adding apartment to wish list:', error);
        }
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
        <p><i class="far fa-address-card"></i> Connection Details: ${params['connectionDetails']}</p>
        
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
    console.log(params[isBooked]);
    // Create either reserveBtn or cancelBtn based on the isBooked status
    const reserveOrCancelBtn = isBooked ? createCancelBtn() : createReserveBtn();

    // Append the button to the container
    buttonContainer.appendChild(reserveOrCancelBtn);
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

// Function to create an approvement box
function createReservationApprovedBox() {
    const approvementBox = document.createElement('div');
    approvementBox.id = 'approvementBox';
    approvementBox.classList.add('approvementBox-box');
    approvementBox.style.display = 'none';

    approvementBox.innerHTML = `
        <span class="close" id="closeReserveApprovementBox">&times;</span>
        <h2>Reservation Approved!</h2>
        <p>Thank you for choosing us! <br>
        For cancelation contact the house owner via email.<br>
        Enjoy your stay!</p>
    `;

    document.body.appendChild(approvementBox);

    const closeReserveApprovementBox = document.getElementById('closeReserveApprovementBox');
    closeReserveApprovementBox.addEventListener('click', () => {
        approvementBox.style.display = 'none';
    });

    return approvementBox;
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
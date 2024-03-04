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
                connectionDetails: apartmentDetails.connectionDetails
            });

            // Redirect to apartment.html with query parameters
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
    // Display apartment details with icons
    const apartmentDetailsContainer = document.getElementById('apartment_details');
    apartmentDetailsContainer.innerHTML = `
        <h2><i class="fas fa-map-marker-alt"></i> Location: ${params['location']}</h2>
        <p><i class="fas fa-sack-dollar"></i> Price Per Night: ${params['pricePerNight']}</p>
        <p><i class="far fa-calendar-alt"></i> Availability: ${params['availability']}</p>
        <p><i class="far fa-star"></i> Reviews: ${params['reviews']}</p>
        <p><i class="fas fa-star"></i> Average Rate: ${params['avgRate']}</p>
        <p><i class="far fa-address-card"></i> Connection Details: ${params['connectionDetails']}</p>
        <!-- Replace the button with a heart icon -->
        <button id="likeBtn" class="likeBtn-white"><i class="fas fa-heart"></i> Like</button>
        <button id="reserveBtn">Reserve</button>
        <button id="recommendBtn">Recommend</button>

        <!-- Add modal for recommendation -->
        <div id="recommendModal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close" id="closeRecommendModal">&times;</span>
                <h2>Recommendation</h2>
                <label for="rating">Rating (1-5):</label>
                <input type="number" id="rating" name="rating" min="1" max="5" required>
                <label for="review">Review:</label>
                <textarea id="review" name="review" rows="4" cols="50" placeholder="Write your review..." required></textarea>
                <button id="submitRecommendation">Submit</button>
            </div>
        </div>
    `;

    // Set the image source to the fetched image URL
    const apartmentImage = document.getElementById('apartment_image');
    apartmentImage.src = params['photo']; // Assuming 'photo' is the parameter containing the image URL

}

// Execute onPageLoad function when the page loads
document.addEventListener('DOMContentLoaded', ()=> {
    onPageLoad();


    const recommendBtn = document.getElementById('recommendBtn');
    const recommendModal = document.getElementById('recommendModal');
    const closeRecommendModal = document.getElementById('closeRecommendModal');
    const submitRecommendationBtn = document.getElementById('submitRecommendation');

    recommendBtn.addEventListener('click', () => {
        recommendModal.style.display = 'block';
    });

    closeRecommendModal.addEventListener('click', () => {
        recommendModal.style.display = 'none';
    });

    submitRecommendationBtn.addEventListener('click', () => {
        const rating = document.getElementById('rating').value;
        const review = document.getElementById('review').value;

        // Use the rating and review as needed (e.g., send to the server, update UI, etc.)

        // Close the modal
        recommendModal.style.display = 'none';
    });
});

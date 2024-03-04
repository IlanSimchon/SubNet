document.addEventListener('DOMContentLoaded', async () => {
    const wishListContainer = document.getElementById('likedApartments');

    // Function to get the user ID from localStorage
    async function getUserId() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            return user._id; // Adjust this based on the structure of your user data
        }
        return null; // Return null if user data is not available
    }

    // Function to display user details
    async function displayUserDetails() {
        const userDetailsContainer = document.getElementById('personalDetails');

        try {
            // Fetch user details from the server using the user ID
            const response = await fetch(`http://localhost:63341/getUserDetails/${await getUserId()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const userDetails = await response.json();

            // Display user details in the userDetailsContainer
            userDetailsContainer.innerHTML = `
                <p><strong>User ID:</strong> ${userDetails._id}</p>
                <p><strong>Username:</strong> ${userDetails.userName}</p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <p><strong>Phone:</strong> ${userDetails.phone}</p>
            `;

            // Display user's wish list
            const wishList = JSON.parse(localStorage.getItem('wishList')) || [];

            // Populate wish list container
            wishList.forEach(apartmentLocation => {
                const listItem = document.createElement('li');
                listItem.textContent = apartmentLocation; // Adjust based on your apartment data
                wishListContainer.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error fetching user details:', error);
            userDetailsContainer.innerHTML = '<p>Error fetching user details</p>';
        }
    }

    // Function to display the edit profile form
    function displayEditProfileForm() {
        const editProfileFormContainer = document.getElementById('editProfileForm');
        editProfileFormContainer.style.display = 'block';

        // Fetch current user details and pre-fill the form
        // You can use the same endpoint as getUserDetails and pre-fill the form with the fetched data
    }

    // Event listener for the "Edit" button
    const editProfileBtn = document.getElementById('editProfileBtn');
    editProfileBtn.addEventListener('click', displayEditProfileForm);

    // Function to add an apartment to the wish list
    function addToWishList(apartmentName) {
        const listItem = document.createElement('li');
        listItem.textContent = apartmentName;
        wishListContainer.appendChild(listItem);

        // Save the updated wish list to local storage or send a request to the server to update the wish list
        // You can use localStorage or make a server request to store wish list data
    }

    // Event listener for the "Add to wish list" button
    const addToWishListBtn = document.getElementById('addToWishListBtn');
    addToWishListBtn.addEventListener('click', () => {
        const apartmentName = prompt('Enter the name of the apartment:');
        if (apartmentName) {
            addToWishList(apartmentName);
        }
    });

    // Call the function to display user details when the page loads
    await displayUserDetails();
});

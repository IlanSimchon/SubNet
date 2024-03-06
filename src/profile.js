// ------ Display Current user details --------
document.addEventListener('DOMContentLoaded', function () { // V
    // Get the user details when the page is loaded
    getUserDetails();

    // Add event listener to the Reveal Password button
    document.getElementById('revealPasswordBtn').addEventListener('click', function () {
        // Reveal the password
        revealPassword();
    });
});

async function getUserDetails() {
    const userName = await getCurrentUsername();

    // Make an AJAX request to the server
    fetch(`http://localhost:63341/getUser?userName=${userName}`)
        .then(response => response.json())
        .then(data => {
            // Check if the response contains user details
            console.log(data)
            if (data.error) {
                console.error(data.error);
            } else {
                // Update the content of the "myDetails" div with user details
                displayDetails(data);
            }
        })
        .catch(error => console.error('Error fetching user details:', error));
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

// Function to reveal the password
function revealPassword() {
    const passwordElement = document.getElementById('userPassword');
    
    // Check if the password element exists
    if (passwordElement) {
        // Display the password
        passwordElement.style.display = 'block';
    }
}

// Function to update the content of the "myDetails" div with user details
function displayDetails(user) {
    const myDetailsDiv = document.getElementById('myDetails');
    
    // Create HTML content with user details
    const detailsHTML = `
        <p>Username: ${user.userName}</p>
        <p>Password: <span id="userPassword" style="display: none;">${user.password}</span>
            <button id="revealPasswordBtn" onclick="togglePassword()">Show/Hide Password</button>
        </p>
        <p>Phone Number: ${user.phone}</p>
        <p>Email: ${user.email}</p>
    `;

    // Set the HTML content of the "myDetails" div
    myDetailsDiv.innerHTML = detailsHTML;
}

// Function to reveal or hide the password - the function is used in a innerHtml inside "displayDetails"
function togglePassword() {
    const passwordElement = document.getElementById('userPassword');
    
    // Check if the password element exists
    if (passwordElement) {
        // Toggle the display of the password
        passwordElement.style.display = (passwordElement.style.display === 'none') ? 'inline' : 'none';
    }
}


// ----------- Edit user details --------
document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to the Edit Profile button
    document.getElementById('editProfileBtn').addEventListener('click', function () {
        editProfileForm();
    });
});

let editProfileFormAppended = false; // Variable to track whether the form has been appended

// Function to show/hide the edit profile form
async function editProfileForm() {
    let newPassword = "";
    let newEmail = "";
    let newPhone = "";
    
    // Check if the form has already been appended
    if (!editProfileFormAppended) {
        const editProfileForm = document.createElement('div');
        editProfileForm.id = 'editProfileForm';
        editProfileForm.className = 'editProfileForm';
        editProfileForm.style.display = 'block';

        editProfileForm.innerHTML = `
            <button id="closeEditFormBtn" class="closeEditFormBtn">&times;</button>
            <form id="EditProfile">
                <label for="password">Password:</label>
                <input type="text" id="passwordInput">

                <label for="email">Email:</label>
                <input type="text" id="emailInput">

                <label for="phone">Phone Number</label>
                <input type="text" id="phoneInput">

                <button type="submit" id="changeDetails">Save Changes</button>
            </form>`;

        // Add event listener to the close button
        const closeBtn = editProfileForm.querySelector('#closeEditFormBtn');
        closeBtn.addEventListener('click', function () {
            editProfileForm.style.display = 'none';
            editProfileFormAppended = false;
        });

        // Add event listener to the form submission
        const editProfileFormElement = editProfileForm.querySelector('#EditProfile');
        editProfileFormElement.addEventListener('submit', function (event) {
            event.preventDefault();

            // Gather values from form inputs
            newPassword = document.getElementById('passwordInput').value.trim();
            newEmail = document.getElementById('emailInput').value.trim();
            newPhone = document.getElementById('phoneInput').value.trim();

            // Check if any input is empty
            /*if (newPassword === '' || newEmail === '' || newPhone === '') {
                alert('Please fill in all fields.');
                return 0;
            }*/

            // Handle the logic to update user details with the new values
            // (You can replace the following code with your server request logic)
            console.log('New Password:', newPassword);
            console.log('New Email:', newEmail);
            console.log('New Phone:', newPhone);

            // Close the form after handling the submission
            editProfileForm.style.display = 'none';
        });

        // Append the form to the body
        document.body.appendChild(editProfileForm);

        // Set the variable to true to indicate that the form has been appended
        editProfileFormAppended = true;
    }

    // Display the form
    document.getElementById('editProfileForm').style.display = 'block';

    // Send the details to the server
    const userName = await getCurrentUsername()
    console.log(userName,newPassword,newEmail,newPhone);
    await UpdateUser(userName,newPassword,newEmail,newPhone);
}

async function UpdateUser(userId, password, email, phone) { // V
    try {
        // Make a PATCH request to updateUser route
        console.log(userId);
        const response = await fetch(`http://localhost:63341/updateUser/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email, phone })
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error updating user details:', error);
    }
}

// ------------ apartment wish list ----------

/*document.addEventListener('DOMContentLoaded', async () => {
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
            const response = await fetch(`http://localhost:63341/getUser/${await getUserId()}`);
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
});*/

// todo: button id="submitEditProfile,  use editProfileBox()
// ------ Display Current user details --------
document.addEventListener('DOMContentLoaded', function () {
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

document.addEventListener('DOMContentLoaded', async function () {
    // Add event listener to the Edit Profile button
    document.getElementById('editProfileBtn').addEventListener('click', async function () {
        try {
            const { userName, newPassword, newEmail, newPhone } = await editProfileForm();

            // Form submitted successfully, update user details
            await UpdateUser(userName.id, newPassword, newEmail, newPhone);

            console.log('User details updated successfully!');
        } catch (error) {
            console.error('Error updating user details:', error);
            // Handle error gracefully, e.g., display an error message to the user
        }
    });
});

let editProfileFormAppended = false; // Variable to track whether the form has been appended

// Function to show/hide the edit profile form
async function editProfileForm() {
    const userName = await getCurrentUsername();
    let newPassword = userName.password || '';
    let newEmail = userName.email || '';
    let newPhone = userName.phone || '';
    //let details = {newPassword, newEmail, newPhone}

    // Check if the form has already been appended
    if (!editProfileFormAppended) {
        const editProfileForm = document.createElement('div');
        editProfileForm.id = 'editProfileForm';
        editProfileForm.className = 'editProfileForm';
        editProfileForm.style.display = 'block';

        editProfileForm.innerHTML = `
            <button id="closeEditFormBtn" class="closeEditFormBtn">&times;</button>
            <form id="EditProfile">
                <label for="newPassword">Password:</label>
                <input type="text" id="passwordInput">

                <label for="newEmail">Email:</label>
                <input type="text" id="emailInput">

                <label for="newPhone">Phone Number</label>
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
            console.log("details changed:"+ newPassword, newEmail, newPhone);
            UpdateUser(userName, newPassword, newEmail, newPhone);

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
    // Return the updated details as an object
    return { userName: userName.id, newPassword, newEmail, newPhone };
}

async function UpdateUser(userId, password, email, phone) {
    try {
        const response = await fetch(`http://localhost:63341/updateUser/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email, phone })
        });

        if (!response.ok) {
            throw new Error(`Error updating user details: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Return the parsed JSON data (optional)
    } catch (error) {
        console.error('Error updating user details:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
}

// ------------ apartment wish list ----------
document.addEventListener('DOMContentLoaded', async () => {
    const wishListContainer = document.getElementById('likedApartment');
    const username = await getCurrentUsername();

    // Call the function to get liked apartments for the current user
    const likedApartments = await getLikedApartments(username);

    // Update the HTML content of the wishListContainer
    for (let apt of likedApartments) {
        console.log(apt.apartmentId);
        displayApartments(apt.apartmentId);
    }
});

// Function to display apartments (adjust this function based on how you want to display apartments)
async function displayApartments(apartmentId) {
    console.log("apartment: " , apartmentId)
    // ApartmentManager.displaySingleApartment(apartmentId);
    try {
        // Fetch apartment details from the server using apartmentId
        const apartment = await getApartmentDetails(apartmentId);

        const content = document.querySelector('.content');


        let imageUrl = `http://localhost:63341/getApartmentPic/${apartment._id}`;
        const availability = formatAvailabilityDate(apartment.availability);

        const apartmentBox = document.createElement('div');
        apartmentBox.classList.add('apartment-box');
        apartmentBox.innerHTML = `
                    <img class="apartment-photo" src="${imageUrl}" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                    <p><i class='fas fa-map-marker-alt'></i> ${apartment.location}</p>
                    <p><i class="fas fa-sack-dollar"></i> ${apartment.pricePerNight} per night</p>
                    <p><i class="fa fa-calendar-alt"></i> ${availability}</p> <!-- Display formatted availability here -->
                    ${generateStarRating(apartment.avgRate)}
                    <p><i class="fa fa-address-card"></i> ${apartment.connectionDetails}</p>
                    <hr>
                `;

        // Append the apartment box to the container
        content.appendChild(apartmentBox);
    } catch (error) {
        console.error(error);
    }
}

async function getApartmentDetails(apartmentId) {
    try {
        // Fetch apartment details from the server using apartmentId
        const response = await fetch(`http://localhost:63341/ApartmentByID/${apartmentId}`);
        const apartmentDetails = await response.json();
        console.log("apartmentDetails:", apartmentDetails)
        return apartmentDetails
    } catch (error) {
        console.error('Error fetching apartment details:', error);
    }
}

// Function to get liked apartments for a user
async function getLikedApartments(userId) {
    try {
        // Make a GET request to the server to get liked apartments
        const response = await fetch(`http://localhost:63341/likedApartments/${userId}`);
        const data = await response.json();
        return data; // Return the liked apartments
    } catch (error) {
        console.error('Error getting liked apartments:', error);
        return []; // Return an empty array in case of an error
    }
}

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

function formatAvailabilityDate(availability) {
    console.log(availability)
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
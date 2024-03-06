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
document.getElementById('likedApartments').addEventListener('DOMContentLoaded', async () => {
    const username = getCurrentUsername();

    // Call the function to get liked apartments for the current user
    const likedApartments = await getLikedApartments(username);
    console.log("likedApartments:"+ likedApartments)

    // Update the HTML content of the wishListContainer
    for(let aptId of likedApartments){
        console.log(aptId);
        //displayApartments(aptId);
    }

})

// Function to display all apartments
/*async function displayApartments() {
    try {
        const response = await fetch('http://localhost:63341/apartmentsByBookingStatus/false');
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
                apartmentBox.innerHTML = `
                    <img class="apartment-photo" src="${imageUrl}" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                    <p><i class='fas fa-map-marker-alt'></i> ${apartment.location}</p>
                    <p><i class="fas fa-sack-dollar"></i> ${apartment.pricePerNight} per night</p>
                    <p><i class="fa fa-calendar-alt"></i> ${availability}</p> <!-- Display formatted availability here -->
                    <p><i class="fa fa-address-card"></i> ${apartment.connectionDetails}</p>
                    <hr>
                `;

                // Append the apartment box to the container
                content.appendChild(apartmentBox);
            }

            // Add event listener to the entire apartment box
            content.querySelectorAll('.apartment-box').forEach(apartmentBox => {
                apartmentBox.addEventListener('click', () => {
                    const apartmentId = apartmentBox.querySelector('.apartment-photo').getAttribute('data-apartment-id');
                    apartmentManager.displaySingleApartment(apartmentId);
                });
            });

        } else {
            console.log('No apartments found');
        }
    } catch (error) {
        console.error(error);
    }
}


// displays a single apartment in a new window
async function displaySingleApartment(apartmentId) {
    let single_apartment = null;
    single_apartment = new Apartment(apartmentId);
    single_apartment.getApartmentDetails();
}*/

/*async function displayApartments(apartmentId){
    const response = await fetch(`http://localhost:63341/ApartmentByID/${apartmentId}`);
    const apartmentDetails = await response.json();
    displayApartmentDetails(apartmentDetails);
}

async function displayApartmentDetails(apartmentDetails) {
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
        window.location.href = `profile.html?${queryParams.toString()}`;
    } catch (error) {
        console.error('Error displaying apartment details:', error);
    }

    async function fetchApartmentImage() {
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
}*/

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

/*

    
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
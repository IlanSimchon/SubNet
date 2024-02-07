const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signUpButton = document.getElementById('sign-up'); // Add this line
const signInButton = document.getElementById('sign-in'); // Add this line


registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordContainer = document.getElementById('forgot-password-container');
    const backToSignInLink = document.getElementById('back');
    const signInContainer = document.querySelector('.sign-in');
    const signUpContainer = document.querySelector('.sign-up');

    forgotPasswordLink.addEventListener('click', function (event) {
        event.preventDefault();
        signInContainer.style.display = 'none';
        signUpContainer.style.display = 'none';
        forgotPasswordContainer.style.display = 'block';
    });

    backToSignInLink.addEventListener('click', function (event) {
        event.preventDefault();
        signInContainer.style.display = 'block';
        signUpContainer.style.display = 'none';
        forgotPasswordContainer.style.display = 'none';
    });

    const sendEmailButton = document.getElementById('send-email');
    sendEmailButton.addEventListener('click', function (event) {
            event.preventDefault();
            // Add logic to handle sending the reset email (e.g., using AJAX)
            alert('Email sent successfully!');
            // You may want to hide the forgot password container or redirect the user
            // depending on your implementation.
        });
    signUpButton.addEventListener('click',function (event) {
        event.preventDefault();
        const userNameInput = document.querySelector('.sign-up input[placeholder="Name"]');
        const emailInput = document.querySelector('.sign-up input[placeholder="Email"]');
        const passwordInput = document.querySelector('.sign-up input[placeholder="Password"]');

        const newUser = {
            userName: userNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        };

// Send AJAX request to the server
        fetch('http://localhost:63341/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('User registered successfully:', data);

                // Redirect to homePage.html upon successful sign-in
                window.location.href = 'homePage.html';
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });
    });
    signInButton.addEventListener('click', async function (event) {
        event.preventDefault();
        const emailInput = document.querySelector('.sign-in input[placeholder="Email"]');
        const passwordInput = document.querySelector('.sign-in input[placeholder="Password"]');
        const errorMessage = document.getElementById('error-message'); // Added error message element

        const userCredentials = {
            email: emailInput.value,
            password: passwordInput.value,
        };

        try {
            // Send AJAX request to the server for sign-in
            const response = await fetch('http://localhost:63341/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userCredentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error}`);
            }

            const responseData = await response.json();
            console.log('Sign-in successful:', responseData);

            // Redirect to homePage.html upon successful sign-in
            window.location.href = 'homePage.html';

            // Optionally, you can perform additional actions here before redirecting.
        } catch (error) {
            console.error('Error signing in:', error.message);
            // Handle the error, e.g., display an error message to the user.
            errorMessage.innerHTML = 'Incorrect username or password<br>Please try again.';
        }
    });
});

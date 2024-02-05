const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

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

});

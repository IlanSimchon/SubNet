class house_owner {
    constructor() {
        document.addEventListener('DOMContentLoaded', this.displayApartments.bind(this));
    }

    async displayApartments() {
        const userDataString = localStorage.getItem('userData');
        this.userData = JSON.parse(userDataString).user;
        const userNameValue = this.userData.userName;
        console.log(userNameValue);

        try {
            const response = await fetch(`http://localhost:63341/Apartments?userName=${userNameValue}`);
            const apartments = await response.json();
            console.log(apartments.length)
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


                    const apartmentBox = document.createElement('div');
                    apartmentBox.classList.add('apartment-box');
                    const rateInPercent = 50 / 5 * apartment.avgRate
                    console.log(rateInPercent)
                    // Set the inner HTML content for the apartment box
                    apartmentBox.innerHTML = `
                        <p><i class='fas fa-map-marker-alt'></i> ${apartment.location}</p>
                        <p><i class="fas fa-sack-dollar"></i> ${apartment.pricePerNight} per night</p>
                        <p><i class="fa fa-calendar-alt"></i> ${JSON.stringify(apartment.availability)}</p>
                        ${generateStarRating(apartment.avgRate)}
                         <p><i class="fa fa-address-card"></i> ${apartment.connectionDetails}</p>
                        <img class="apartment-photo" src="${imageUrl}" alt="Apartment Photo" data-apartment-id="${apartment._id}">
                        <hr>
                    `;

                    // Append the apartment box to the container
                    content.appendChild(apartmentBox);
                }

                // Add event listener to the entire apartment box
                content.querySelectorAll('.apartment-box').forEach(apartmentBox => {
                    apartmentBox.addEventListener('click', () => {
                        const apartmentId = apartmentBox.querySelector('.apartment-photo').getAttribute('data-apartment-id');
                        apartmentManager.displayApartmentDetails(apartmentId);
                    });
                });

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
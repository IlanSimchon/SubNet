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

            console.log(apartmentDetails);

            // Call a method to display apartment details
            this.displayApartmentDetails(apartmentDetails);
        } catch (error) {
            console.error('Error fetching apartment details:', error);
        }
    }

    displayApartmentDetails(apartmentDetails) {
        // Construct the query parameters string
        const queryParams = new URLSearchParams({
            location: apartmentDetails.location,
            pricePerNight: apartmentDetails.pricePerNight,
            availability: JSON.stringify(apartmentDetails.availability),
            reviews: apartmentDetails.reviews,
            avgRate: apartmentDetails.avgRate,
            photo: apartmentDetails.photo,
            connectionDetails: apartmentDetails.connectionDetails
        });

        // Redirect to apartment.html with query parameters
        window.location.href = `apartment.html?${queryParams.toString()}`;
    }
}
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
            // Fetch the apartment image URL
            const imageUrl = await this.fetchApartmentImage();
            // Construct the query parameters string
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
    }
}

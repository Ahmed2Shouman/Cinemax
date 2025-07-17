document.addEventListener('DOMContentLoaded', () => {
    // Function to handle theater deletion
    window.deleteTheater = async (id) => {
        if (confirm('Are you sure you want to delete this theater?')) {
            try {
                const response = await fetch(`/api/theaters/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Theater deleted successfully!');
                    location.reload(); // Reload the page to reflect changes
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete theater: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting theater:', error);
                alert('An error occurred while deleting the theater.');
            }
        }
    };

    // Function to handle theater search (client-side filtering)
    window.searchTheaters = () => {
        const searchTerm = document.getElementById('theaterSearch').value.toLowerCase();
        const theaterCards = document.querySelectorAll('.theater-card');
        
        theaterCards.forEach(card => {
            const theaterName = card.querySelector('h2').textContent.toLowerCase();
            const theaterLocation = card.querySelector('p:nth-of-type(1)').textContent.toLowerCase(); // Location is now in a <p> tag
            const theaterContact = card.querySelector('p:nth-of-type(2)').textContent.toLowerCase(); // Contact is in the second <p> tag
            const theaterFeatures = Array.from(card.querySelectorAll('.tags span')).map(span => span.textContent.toLowerCase());

            if (
                theaterName.includes(searchTerm) ||
                theaterLocation.includes(searchTerm) ||
                theaterContact.includes(searchTerm) ||
                theaterFeatures.some(feature => feature.includes(searchTerm))
            ) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };
});

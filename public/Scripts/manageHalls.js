document.addEventListener('DOMContentLoaded', () => {
    // Function to handle hall deletion
    window.deleteHall = async (id) => {
        if (confirm('Are you sure you want to delete this hall?')) {
            try {
                const response = await fetch(`/admin/halls/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    alert('Hall deleted successfully!');
                    location.reload(); // Reload the page to reflect changes
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete hall: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error deleting hall:', error);
                alert('An error occurred while deleting the hall.');
            }
        }
    };

    // Function to handle hall search (client-side filtering)
    window.searchHalls = () => {
        const searchTerm = document.getElementById('hallSearch').value.toLowerCase();
        const hallCards = document.querySelectorAll('.movie-card'); // Reusing class name
        
        hallCards.forEach(card => {
            const hallName = card.querySelector('h2').textContent.toLowerCase();
            const hallFeatures = Array.from(card.querySelectorAll('.tags span')).map(span => span.textContent.toLowerCase());
            
            if (
                hallName.includes(searchTerm) ||
                hallFeatures.some(feature => feature.includes(searchTerm))
            ) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };
});

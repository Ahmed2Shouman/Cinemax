
function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        fetch(`/admin/bookings/${bookingId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                window.location.reload();
            } else if (data.error) {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the booking.');
        });
    }
}

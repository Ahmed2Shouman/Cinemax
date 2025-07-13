function searchMovies() {
  const searchInput = document.getElementById('movieSearch').value.toLowerCase();
  const movieCards = document.querySelectorAll('.movie-card');

  movieCards.forEach(card => {
    const title = card.querySelector('h2').textContent.toLowerCase();
    card.style.display = title.includes(searchInput) ? 'block' : 'none';
  });
}

function deleteMovie(id) {
  if (confirm('Are you sure you want to delete this movie?')) {
    fetch(`/api/movies/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
          location.reload();
        } else {
          alert('Failed to delete movie');
        }
      })
      .catch(err => {
        console.error('Error deleting movie:', err);
        alert('An error occurred while deleting the movie');
      });
  }
}
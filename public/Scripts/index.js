let movies = [];
let current = 0;

// fetching movies for the update slider uunction
async function fetchMovies() {
  try {
    const response = await fetch('/api/movies');
    movies = await response.json();
    updateSlider();
    setInterval(updateSlider, 5000); // call update slider every 5 sec.
  } catch (err) {
    console.error('Failed to fetch movies:', err);
  }
}

// updates the top slider 
function updateSlider() {
  const top = document.getElementById("top-slider");
  const details = document.getElementById("movie-details");

  if (!movies.length) return; // if movies.length = 0 return

  const movie = movies[current];
  top.style.backgroundImage = `linear-gradient(to bottom, transparent, black), url('${movie.banner_url}')`;

  details.innerHTML = `
    <h2 class="highlighted">${movie.status}</h2>
    <h1>${movie.title}</h1>
    <div class="MD">
      <h6><i class="fas fa-film"></i> ${movie.genre}</h6>
      <h6><i class="fas fa-clock"></i> ${movie.duration}</h6>
      <h6><i class="fas fa-star"></i> ${movie.rating}</h6>
    </div>
    <p>${movie.description}</p>
    <a href="/book?name=${movie.title}" class="Button">Book Tickets</a>
    <a href="${movie.trailer}" class="Button" target="_blank">Watch Trailer</a>
  `;

  current = (current + 1) % movies.length; // once current reaches length loop back to 0
}

// makes the bottom slider btns function
function scrollSlider(direction) {
  const slider = document.getElementById('movieSlider');
  const scrollAmount = 300;
  slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// auto scrolls the bottom slider
function autoScrollSlider() {
  const slider = document.getElementById('movieSlider');
  const scrollAmount = 300;
  setInterval(() => {
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, 4000);
}

window.onload = () => {
  fetchMovies();
  autoScrollSlider();
};
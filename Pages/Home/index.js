const movies = [
  {
    title: "Sinners",
    year: "2025",
    time: "2h 30m",
    rating: "8.5",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    image: "../../Images/Sinners.jpg"
  },
  {
    title: "Thunderbolts*",
    year: "2025",
    time: "2h 15m",
    rating: "7.9",
    description: "A ship crew faces a mysterious force in uncharted waters.",
    image: "../../Images/thunderbolts.jpg"
  },
];

let current = 0;

function updateSlider() {
  const top = document.getElementById("top-slider");
  const details = document.getElementById("movie-details");

  const movie = movies[current];
  top.style.backgroundImage = `linear-gradient(to bottom, transparent, black), url('${movie.image}')`;

  details.innerHTML = `
    <h2 class="highlighted">Now Playing</h2>
    <h1>${movie.title}</h1>
    <div class="MD">
      <h6><i class="fas fa-calendar-alt"></i> ${movie.year}</h6>
      <h6><i class="fas fa-clock"></i> ${movie.time}</h6>
      <h6><i class="fas fa-star"></i> ${movie.rating}</h6>
    </div>
    <p>${movie.description}</p>
    <a href="#" class="Button">Book Tickets</a>
    <a href="#" class="Button-outlined">Watch Trailer</a>
  `;

  current = (current + 1) % movies.length;
}

setInterval(updateSlider, 5000); // change every 5 seconds
window.onload = updateSlider; // initial load
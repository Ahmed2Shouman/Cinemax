const movies = [
  {
    title: "Sinners",
    year: "2025",
    time: "2h 30m",
    rating: "8.5",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    image: "../../Images/Sinners.jpg",
    trailer: "https://www.youtube.com/watch?v=bKGxHflevuk"
  },
  {
    title: "Thunderbolts*",
    year: "2025",
    time: "2h 15m",
    rating: "7.9",
    description: "A ship crew faces a mysterious force in uncharted waters.",
    image: "../../Images/thunderbolts.jpg",
    trailer: "https://www.youtube.com/watch?v=VlaAD_F_6ao"
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
    <a href="../Book/book.html" class="Button">Book Tickets</a>
    <a href="${movie.trailer}" class="Button" target="_blank">Watch Trailer</a>
  `;

  current = (current + 1) % movies.length;
}

function scrollSlider(direction) {
  const slider = document.getElementById('movieSlider');
  const scrollAmount = 300;
  slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

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

setInterval(updateSlider, 5000); // change every 5 seconds
window.onload = () => {
  updateSlider();
  autoScrollSlider();
};
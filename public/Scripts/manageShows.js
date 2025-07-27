document.addEventListener('DOMContentLoaded', () => {
    const movieFilter = document.getElementById('movie-filter');
    const theaterFilter = document.getElementById('theater-filter');
    const dateFilter = document.getElementById('date-filter');
    const featureFilter = document.getElementById('feature-filter');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const showRows = document.querySelectorAll('.show-row');

    function filterShows() {
        const movieValue = movieFilter.value;
        const theaterValue = theaterFilter.value;
        const dateValue = dateFilter.value;
        const featureValue = featureFilter.value;

        showRows.forEach(row => {
            const movieMatch = !movieValue || row.dataset.movie === movieValue;
            const theaterMatch = !theaterValue || row.dataset.theater === theaterValue;
            const dateMatch = !dateValue || row.dataset.date === dateValue;
            const featureMatch = !featureValue || row.dataset.feature === featureValue;

            if (movieMatch && theaterMatch && dateMatch && featureMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function resetFilters() {
        movieFilter.value = '';
        theaterFilter.value = '';
        dateFilter.value = '';
        featureFilter.value = '';
        filterShows();
    }

    movieFilter.addEventListener('change', filterShows);
    theaterFilter.addEventListener('change', filterShows);
    dateFilter.addEventListener('change', filterShows);
    featureFilter.addEventListener('change', filterShows);
    resetFiltersBtn.addEventListener('click', resetFilters);
});

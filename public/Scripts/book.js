document.addEventListener('DOMContentLoaded', () => {
    // Event listeners can be set up here if needed
});

function getLocalDateString(isoString) {
    if (!isoString) return null;
    const localDate = new Date(isoString);
    const year = localDate.getFullYear();
    const month = localDate.getMonth() + 1;
    const day = localDate.getDate();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

let selectedTheater = null;
let selectedFeature = null;
let selectedDate = null;
let selectedTime = null;
let selectedShowId = null;
let mySeats = [];
let allShows = [];

const movieId = document.getElementById('movie-details').dataset.movieId;

async function theaterSelected() {
    const theaterSelect = document.getElementById('theater-select');
    selectedTheater = theaterSelect.value;

    resetFeatureDateAndTime();
    resetSeats();

    if (!selectedTheater) {
        populateFeatureOptions([]);
        populateDateOptions([]);
        populateTimeOptions([]);
        return;
    }

    try {
        const response = await fetch(`/api/shows?movieId=${movieId}&theaterId=${selectedTheater}`);
        if (!response.ok) throw new Error('Failed to fetch shows');
        
        allShows = await response.json();
        populateFeatureOptions(allShows);
    } catch (error) {
        console.error('Error fetching shows:', error);
        populateFeatureOptions([]);
        populateDateOptions([]);
        populateTimeOptions([]);
    }
    updateSummary();
}

function featureSelected() {
    const featureSelect = document.getElementById('feature-options');
    selectedFeature = featureSelect.value;
    selectedDate = null;
    selectedTime = null;
    selectedShowId = null;
    mySeats = [];
    resetSeats();

    if (!selectedFeature) {
        populateDateOptions([]);
        populateTimeOptions([]);
        return;
    }

    populateDateOptions(allShows.filter(show => show.feature === selectedFeature));
    updateSummary();
}

function dateSelected() {
    const dateSelect = document.getElementById('date-options');
    selectedDate = dateSelect.value;
    selectedTime = null;
    selectedShowId = null;
    mySeats = [];
    resetSeats();

    if (!selectedDate) {
        populateTimeOptions([]);
        return;
    }

    populateTimeOptions(allShows.filter(show => show.feature === selectedFeature && getLocalDateString(show.show_date) === selectedDate));
    updateSummary();
}

function populateFeatureOptions(shows) {
    const features = [...new Set(shows.map(show => show.feature))];
    const featureOptions = document.getElementById('feature-options');
    featureOptions.innerHTML = '<option value="" disabled selected>Choose a feature</option>';

    features.forEach(feature => {
        const option = document.createElement('option');
        option.value = feature;
        option.textContent = feature;
        featureOptions.appendChild(option);
    });
}

function populateDateOptions(shows) {
    const dates = [...new Set(shows.map(show => getLocalDateString(show.show_date)))];
    const dateOptions = document.getElementById('date-options');
    dateOptions.innerHTML = '<option value="" disabled selected>Choose a date</option>';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    dates.forEach(dateString => {
        const [year, month, day] = dateString.split('-').map(Number);
        // Create a Date object representing noon UTC on the specified date to avoid timezone issues
        const showDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        console.log(`populateDateOptions: dateString: ${dateString}, showDate (UTC noon): ${showDate.toISOString()}, showDate (local): ${showDate.toString()}`);

        if (showDate >= today) {
            const option = document.createElement('option');
            option.value = dateString;
            // Format for display in local timezone
            const formattedDisplayDate = showDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            option.textContent = formattedDisplayDate;
            console.log(`populateDateOptions: formattedDisplayDate: ${formattedDisplayDate}`);
            dateOptions.appendChild(option);
        }
    });
}

function populateTimeOptions(shows) {
    const timeOptions = document.getElementById('time-options');
    timeOptions.innerHTML = '<option value="" disabled selected>Choose a time</option>';

    if (!selectedDate) {
        return;
    }

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = selectedDate.split('-').map(Number);
    const selectedShowDate = new Date(parts[0], parts[1] - 1, parts[2]);

    const isToday = selectedShowDate.getTime() === today.getTime();

    const times = allShows.filter(show => {
        const showDateMatch = getLocalDateString(show.show_date) === selectedDate;
        const featureMatch = show.feature === selectedFeature; // Add this line
        if (!showDateMatch || !featureMatch) return false; // Modify this line

        if (isToday) {
            const showTime = new Date(`${selectedDate}T${show.start_time}`);
            return showTime > now;
        }
        return true;
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));

    times.forEach(show => {
        const option = document.createElement('option');
        option.value = show.id;
        option.textContent = `${show.start_time.substring(0, 5)}`;
        option.dataset.showTime = show.start_time;
        timeOptions.appendChild(option);
    });
}

function resetFeatureDateAndTime() {
    selectedFeature = null;
    selectedDate = null;
    selectedTime = null;
    selectedShowId = null;
    mySeats = [];
    allShows = [];

    document.getElementById('feature-options').innerHTML = '<option value="" disabled selected>Choose a feature</option>';
    document.getElementById('date-options').innerHTML = '<option value="" disabled selected>Choose a date</option>';
    document.getElementById('time-options').innerHTML = '<option value="" disabled selected>Choose a time</option>';
}

async function timeSelected() {
    const timeSelect = document.getElementById('time-options');
    selectedShowId = timeSelect.value;
    const selectedOption = timeSelect.options[timeSelect.selectedIndex];
    selectedTime = selectedOption ? selectedOption.dataset.showTime : null;

    mySeats = [];
    resetSeats();

    if (!selectedShowId) {
        document.getElementById('seat-selection').style.display = 'none';
        return;
    }

    try {
        const [seatsResponse, hallResponse] = await Promise.all([
            fetch(`/api/shows/seats?showId=${selectedShowId}`),
            fetch(`/api/shows/hall/${selectedShowId}`)
        ]);

        if (!seatsResponse.ok) throw new Error('Failed to fetch seats');
        if (!hallResponse.ok) throw new Error('Failed to fetch hall details');

        const takenSeats = await seatsResponse.json();
        const hallDetails = await hallResponse.json();

        generateSeatMap(hallDetails.seat_rows, hallDetails.seat_columns, hallDetails.chairs_in_section);
        markTakenSeats(takenSeats.map(s => s.seat_number));
        document.getElementById('seat-selection').style.display = 'block';

    } catch (error) {
        console.error('Error fetching seats or hall details:', error);
        document.getElementById('seat-selection').style.display = 'none';
    }
    updateSummary();
}

function resetSeats() {
    document.querySelectorAll('.seat').forEach(seat => {
        seat.classList.remove('taken', 'selected');
    });
}

function markTakenSeats(seats) {
    seats.forEach(seatNumber => {
        const seatElement = document.querySelector(`.seat[data-seat="${seatNumber}"]`);
        if (seatElement) {
            seatElement.classList.add('taken');
        }
    });
}

function generateSeatMap(rows, cols, seatsPerSection) {
    const seatMap = document.querySelector('.seat-map');
    seatMap.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const rowLabel = String.fromCharCode(65 + i);
        const seatRow = document.createElement('div');
        seatRow.classList.add('seat-row');

        const rowLabelElement = document.createElement('h3');
        rowLabelElement.classList.add('row-label');
        rowLabelElement.textContent = rowLabel;
        seatRow.appendChild(rowLabelElement);

        let seatNumber = 1;
        let seatGroup = document.createElement('div');
        seatGroup.classList.add('seat-group');

        for (let j = 0; j < cols; j++) {
            if (j > 0 && j % seatsPerSection === 0) {
                seatRow.appendChild(seatGroup);
                seatGroup = document.createElement('div');
                seatGroup.classList.add('seat-group');
            }

            const seat = document.createElement('button');
            seat.classList.add('seat');
            const seatId = `${rowLabel}${seatNumber}`;
            seat.dataset.seat = seatId;
            seat.textContent = seatNumber;
            seat.onclick = () => toggleSeatSelection(seat);
            seatGroup.appendChild(seat);
            seatNumber++;
        }
        seatRow.appendChild(seatGroup);
        seatMap.appendChild(seatRow);
    }
}

function toggleSeatSelection(selectedElement) {
    if (selectedElement.classList.contains('taken')) {
        return;
    }

    selectedElement.classList.toggle('selected');
    const seatNumber = selectedElement.getAttribute('data-seat');

    if (selectedElement.classList.contains('selected')) {
        mySeats.push(seatNumber);
    } else {
        mySeats = mySeats.filter(seat => seat !== seatNumber);
    }

    updateSummary();
}

function updateSummary() {
    const summary = document.getElementById('summary');
    const theaterSelect = document.getElementById('theater-select');
    const selectedTheaterName = selectedTheater ? theaterSelect.options[theaterSelect.selectedIndex].text : 'No theater selected';
    const selectedFeatureName = selectedFeature || 'No feature selected';
    
    let formattedDate = 'No date selected';
    if (selectedDate) {
        const [year, month, day] = selectedDate.split('-').map(Number);
        // Create a Date object representing noon UTC on the selected date to avoid timezone issues
        const displayDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
        console.log(`updateSummary: selectedDate: ${selectedDate}, displayDate (UTC noon): ${displayDate.toISOString()}, displayDate (local): ${displayDate.toString()}`);
        // Format for display in the user's local timezone
        formattedDate = displayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        console.log(`updateSummary: formattedDate: ${formattedDate}`);
    }
    
    const formattedTime = selectedTime ? selectedTime.substring(0, 5) : 'No time selected';

    summary.innerHTML = `
        <p><strong>Theater</strong> <span class="summary-theater">${selectedTheaterName}</span></p>
        <p><strong>Feature</strong> <span class="summary-feature">${selectedFeatureName}</span></p>
        <p><strong>Date</strong> <span class="summary-date">${formattedDate}</span></p>
        <p><strong>Time</strong> <span class="summary-time">${formattedTime}</span></p>
        <p><strong>Seats</strong> <span class="summary-seats">${mySeats.length > 0 ? mySeats.join(', ') : 'No seats selected'}</span></p>
        <button class="confirm-btn${mySeats.length > 0 && selectedShowId ? '' : ' disabled'}" onclick="proceedToCheckout()">
          ${mySeats.length > 0 && selectedShowId ? 'Proceed to Checkout' : 'Select a show and at least one seat'}
        </button>
    `;
}

async function proceedToCheckout() {
    if (mySeats.length > 0 && selectedShowId) {
        const seatsQuery = mySeats.join(',');
        window.location.href = `/checkout?showId=${selectedShowId}&seats=${seatsQuery}`;
    }
}

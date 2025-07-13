var selectedDate = null;
var selectedTime = null;
var selectedSeats = ["A1", "A2", "A3", "C5", "C6"]; // Example selected seats
var mySeats = []; // Array to hold user's selected seats


// Date Selecion
function dateSelected(selectedElement) {
    const allBtns = document.querySelectorAll('.date');
    allBtns.forEach(btn => {
        btn.classList.remove('selected');
    });                                                     // Remove 'selected' class from all date buttons

    selectedElement.classList.add('selected');              // add 'selected' class to the clicked button
    selectedDate = selectedElement.textContent;             // Get the date of the clicked button
    console.log('Selected Date:', selectedDate);            // Delete this
    updateSummary();                                        // Update the booking summary with the selected date 
}

//time Selection
function timeSelected(selectedElement) {
    const allBtns = document.querySelectorAll('.time');
    allBtns.forEach(btn => {
        btn.classList.remove('selected');
    });                                                     // Remove 'selected' class from all time buttons

    selectedElement.classList.add('selected');              // add 'selected' class to the clicked button
    selectedTime = selectedElement.textContent;             // Get the time of the clicked button
    console.log('Selected Time:', selectedTime);            // Delete this
    getSelectedSeats(selectedSeats);                        // Mark the selected seats as taken
    console.log('Selected Seats:', selectedSeats);          // Delete this
    updateSummary();                                        // Update the booking summary with the selected date and time
}


// mark the selected seats as taken
function getSelectedSeats(seats) {
    seats.forEach(seat => {
        const seatElement = document.querySelector(`.seat[data-seat="${seat}"]`);   // Select the seat element using its data-seat attribute
        if (seatElement) {                                                          // Check if the seat element exists
            seatElement.classList.add('taken');                                     // Add the 'taken' class to the seat
        }
    });
}

function toggleSeatSelection(selectedElement) {
    if (selectedElement.classList.contains('taken')) {
        return;
    }                                                                                // If the seat is taken, do nothing

    selectedElement.classList.toggle('selected');                                   // Toggle the 'selected' class on the clicked seat
    const seatNumber = selectedElement.getAttribute('data-seat');                  // Get the seat number from the data-seat attribute

    // if the seat is selected, add it to mySeats, otherwise remove it
    if (selectedElement.classList.contains('selected')) {
        mySeats.push(seatNumber);
    } else {
        mySeats = mySeats.filter(seat => seat !== seatNumber);
    }

    updateSummary();                                                              // Update the booking summary with the selected seats

    console.log('Updated Selected Seats:', mySeats); //delete this
}


// Update the booking summary with the selected date, time, and seats
function updateSummary() {
    const summary = document.getElementById('summary');
    summary.innerHTML = `
        <p><strong>Date</strong> <span class="summary-date">${selectedDate ? selectedDate : 'No date selected'}</span></p>
        <p><strong>Time</strong> <span class="summary-time">${selectedTime ? selectedTime : 'No time selected'}</span></p>
        <p><strong>Seats</strong> <span class="summary-seats">${mySeats.length > 0 ? mySeats.join(', ') : 'No seats selected'}</span></p>
        <button class="confirm-btn${mySeats.length > 0 && selectedDate!== null && selectedTime !== null ? '' : ' disabled'}">
          ${mySeats.length > 0 && selectedDate!== null && selectedTime !== null ? 'Proceed to Checkout' : 'Select at least one seat'}
        </button>
    `;

}
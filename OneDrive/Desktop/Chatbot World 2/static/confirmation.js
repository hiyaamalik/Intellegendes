function showConfirmationCard({ name, date, time, service }) {
  const card = document.getElementById('confirmation-card');
  card.innerHTML = `
    <div class="checkmark">✔️</div>
    <div class="confirmation-title">Booking Confirmed!</div>
    <div class="confirmation-details">
      <b>Name:</b> ${name || 'User'}<br>
      <b>Service:</b> ${service}<br>
      <b>Date:</b> ${date}<br>
      <b>Time:</b> ${time}
    </div>
    <button class="confirmation-btn" id="back-to-chat">Book Another Appointment</button>
  `;
  card.style.display = 'flex';
  document.getElementById('chat-area').style.display = 'none';
  document.getElementById('chat-input-bar').style.display = 'none';
  document.getElementById('loader').style.display = 'none';
  document.getElementById('services-fab').style.display = 'none';
  document.getElementById('services-menu').style.display = 'none';
  document.getElementById('back-to-chat').onclick = () => {
    card.style.display = 'none';
    document.getElementById('chat-area').style.display = 'flex';
    document.getElementById('chat-input-bar').style.display = 'flex';
    document.getElementById('services-fab').style.display = 'flex';
  };
}
// Example usage:
// showConfirmationCard({ name: 'John Doe', date: '2024-06-10', time: '10:00 AM', service: 'Dental Checkup' }); 
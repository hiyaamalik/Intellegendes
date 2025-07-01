const servicesFab = document.getElementById('services-fab');
const servicesMenu = document.getElementById('services-menu');
const serviceOptions = [
  { name: 'Allergy Test', icon: '🌾' },
  { name: 'Dental Checkup', icon: '🦷' },
  { name: 'Eye Test', icon: '👁️' },
  { name: 'General Checkup', icon: '🩺' },
  { name: 'Vaccination', icon: '💉' }
];

servicesFab.onclick = () => {
  if (servicesMenu.style.display === 'none' || !servicesMenu.style.display) {
    renderServicesMenu();
    servicesMenu.style.display = 'flex';
  } else {
    servicesMenu.style.display = 'none';
  }
};

function renderServicesMenu() {
  servicesMenu.innerHTML = '';
  serviceOptions.forEach(opt => {
    const item = document.createElement('div');
    item.className = 'service-item';
    item.innerHTML = `<span class="service-icon">${opt.icon}</span> ${opt.name}`;
    item.onclick = () => {
      // Send service name to chat as user message
      document.getElementById('chat-input').value = opt.name;
      document.getElementById('send-btn').click();
      servicesMenu.style.display = 'none';
    };
    servicesMenu.appendChild(item);
  });
} 
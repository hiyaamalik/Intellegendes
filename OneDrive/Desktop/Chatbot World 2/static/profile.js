const profileContent = document.getElementById('profile-content');
const profileHeader = document.querySelector('.profile-header h3');

const ICONS = {
  name: '👤',
  gender: '🚻',
  age: '🎂',
  conditions: '💊',
  lifestyle: '🏃',
};

function updateProfile(profile) {
  if (profileHeader) {
    if (profile && profile.name) {
      profileHeader.innerHTML = `Your Health Profile <span style='font-weight:400;font-size:1rem;color:#2563eb;'>for ${profile.name}</span>`;
    } else {
      profileHeader.textContent = 'Your Health Profile';
    }
  }
  if (!profile || Object.keys(profile).length === 0) {
    profileContent.innerHTML = '<div class="profile-placeholder">Start answering to build your profile...</div>';
    return;
  }
  let html = '';
  if (profile.name) {
    html += `<div class="profile-item" style="background:#e3f2fd;font-size:1.1rem;font-weight:600;justify-content:center;text-align:center;border:2px solid #2563eb;"><span class="profile-label" style="font-size:1.3rem;">${ICONS.name}</span> <span class="profile-value" style="color:#2563eb;">${profile.name}</span></div>`;
  }
  if (profile.gender) {
    html += `<div class="profile-item"><span class="profile-label">${ICONS.gender} Gender:</span> <span class="profile-value">${profile.gender}</span></div>`;
  }
  if (profile.age) {
    html += `<div class="profile-item"><span class="profile-label">${ICONS.age} Age:</span> <span class="profile-value">${profile.age}</span></div>`;
  }
  if (profile.conditions) {
    html += `<div class="profile-item"><span class="profile-label">${ICONS.conditions} Conditions:</span> <span class="profile-value">${profile.conditions}</span></div>`;
  }
  if (profile.lifestyle) {
    html += `<div class="profile-item"><span class="profile-label">${ICONS.lifestyle} Lifestyle:</span> <span class="profile-value">${profile.lifestyle}</span></div>`;
  }
  profileContent.innerHTML = html;
}

// Export for use in chatbot.js
window.updateProfile = updateProfile; 
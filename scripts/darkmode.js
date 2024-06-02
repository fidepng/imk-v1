// dark-mode.js
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeStylesheet = document.getElementById('theme-stylesheet');

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);

  // Mengubah ikon tombol
  const icon = isDarkMode ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
  themeToggleBtn.innerHTML = icon;

  // Mengubah latar belakang dan warna teks
  const rootStyles = document.documentElement.style;
  if (isDarkMode) {
    rootStyles.setProperty('--primary-color', '#4facfe');
    rootStyles.setProperty('--secondary-color', '#2a5298');
    rootStyles.setProperty('--text-color', '#e0e0e0');
  } else {
    rootStyles.setProperty('--primary-color', '#007bff');
    rootStyles.setProperty('--secondary-color', '#28a745');
    rootStyles.setProperty('--text-color', '#333');
  }

  // Animasi transisi mode
  document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 500);
}

function initDarkMode() {
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', isDarkMode);

  // Mengatur ikon tombol saat inisialisasi
  const icon = isDarkMode ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
  themeToggleBtn.innerHTML = icon;

  // Menyesuaikan latar belakang saat inisialisasi
  const rootStyles = document.documentElement.style;
  if (isDarkMode) {
    rootStyles.setProperty('--primary-color', '#4facfe');
    rootStyles.setProperty('--secondary-color', '#2a5298');
    rootStyles.setProperty('--text-color', '#e0e0e0');
  } else {
    rootStyles.setProperty('--primary-color', '#007bff');
    rootStyles.setProperty('--secondary-color', '#28a745');
    rootStyles.setProperty('--text-color', '#333');
  }
}

// Menerapkan preferensi pengguna saat halaman dimuat
document.addEventListener('DOMContentLoaded', initDarkMode);

// Event listener untuk toggle mode gelap
themeToggleBtn.addEventListener('click', toggleDarkMode);

// Preferensi sistem
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
prefersDarkScheme.addListener(e => {
  if (!localStorage.getItem('darkMode')) {
    document.body.classList.toggle('dark-mode', e.matches);
  }
});
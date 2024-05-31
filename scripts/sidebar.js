const sidebarToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const contentWrapper = document.querySelector('.content-wrapper');

// Cek preferensi pengguna yang tersimpan
const isSidebarOpen = localStorage.getItem('sidebarOpen') === 'true';
if (isSidebarOpen) {
  sidebar.classList.add('show');
  contentWrapper.classList.add('shift-left');
  sidebarToggle.checked = true;
}

sidebarToggle.addEventListener('change', function() {
  sidebar.classList.toggle('show');
  contentWrapper.classList.toggle('shift-left');
  
  // Simpan preferensi pengguna
  localStorage.setItem('sidebarOpen', sidebar.classList.contains('show'));
});

// Tambahkan smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
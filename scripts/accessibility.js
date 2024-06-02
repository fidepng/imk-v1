// accessibility.js
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
  
    // Load sidebar content
    fetch('/imk-v1/components/sidebar.html')
      .then(response => response.text())
      .then(html => {
        sidebar.innerHTML = html;
        // Setup event listeners after sidebar content is loaded
        setupAccessibilityFeatures();
      })
      .catch(error => {
        console.error('Error loading sidebar:', error);
      });
  });
  
  function setupAccessibilityFeatures() {
    const closeSidebar = document.getElementById('close-sidebar');
    const fontSizeSelect = document.getElementById('font-size');
    const highContrastToggle = document.getElementById('high-contrast');
    const readAloudBtn = document.getElementById('read-aloud');
    const dyslexiaFontToggle = document.getElementById('dyslexia-font');
    const lightThemeBtn = document.getElementById('light-theme');
    const darkThemeBtn = document.getElementById('dark-theme');
  
    if (closeSidebar) {
      closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('show');
        document.querySelector('.content-wrapper').classList.remove('shift-left');
        document.getElementById('menu-toggle').checked = false;
      });
    }
  
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', (e) => {
        document.body.style.fontSize = e.target.value;
        localStorage.setItem('fontSize', e.target.value);
      });
      // Apply saved font size
      const savedFontSize = localStorage.getItem('fontSize');
      if (savedFontSize) {
        fontSizeSelect.value = savedFontSize;
        document.body.style.fontSize = savedFontSize;
      }
    }
  
    if (highContrastToggle) {
      highContrastToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('high-contrast', e.target.checked);
        localStorage.setItem('highContrast', e.target.checked);
      });
      // Apply saved high contrast setting
      const savedHighContrast = localStorage.getItem('highContrast') === 'true';
      highContrastToggle.checked = savedHighContrast;
      document.body.classList.toggle('high-contrast', savedHighContrast);
    }
  
    if (readAloudBtn) {
      readAloudBtn.addEventListener('click', () => {
        const text = document.querySelector('.menu-container h1').textContent + ' ';
        document.querySelectorAll('.menu-card-title, .menu-card-text').forEach(el => {
          text += el.textContent + ' ';
        });
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      });
    }
  
    if (dyslexiaFontToggle) {
      dyslexiaFontToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dyslexia-font', e.target.checked);
        localStorage.setItem('dyslexiaFont', e.target.checked);
      });
      // Apply saved dyslexia font setting
      const savedDyslexiaFont = localStorage.getItem('dyslexiaFont') === 'true';
      dyslexiaFontToggle.checked = savedDyslexiaFont;
      document.body.classList.toggle('dyslexia-font', savedDyslexiaFont);
    }
  
    if (lightThemeBtn && darkThemeBtn) {
      lightThemeBtn.addEventListener('click', () => {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
      });
  
      darkThemeBtn.addEventListener('click', () => {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
      });
  
      // Apply saved theme
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      if (savedDarkMode) {
        document.body.classList.add('dark-mode');
      }
    }
  }
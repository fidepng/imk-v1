// accessibility.js
const accessibility = {
  speechSynth: window.speechSynthesis,
  focusableElements:
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  currentFocusIndex: 0,
  isEnabled: false,

  init() {
    this.addToggleToSidebar();
    document.addEventListener("keydown", this.handleKeydown.bind(this));
  },

  addToggleToSidebar() {
    const sidebarContent = document.querySelector(".sidebar-content");
    const toggleHtml = `
      <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" id="accessibilityToggle">
        <label class="form-check-label" for="accessibilityToggle">Mode Aksesibilitas</label>
      </div>
    `;
    sidebarContent.insertAdjacentHTML("afterbegin", toggleHtml);

    const toggle = document.getElementById("accessibilityToggle");
    toggle.addEventListener("change", (e) => {
      this.isEnabled = e.target.checked;
      if (this.isEnabled) {
        this.speakText(
          "Mode aksesibilitas diaktifkan. Gunakan tombol Tab untuk bernavigasi dan Enter untuk memilih."
        );
      } else {
        this.speakText("Mode aksesibilitas dinonaktifkan.");
      }
    });
  },

  handleKeydown(e) {
    if (!this.isEnabled) return;

    switch (e.key) {
      case "Tab":
        e.preventDefault();
        this.navigateFocus(e.shiftKey ? -1 : 1);
        break;
      case "Enter":
        this.activateCurrentElement();
        break;
    }
  },

  navigateFocus(direction) {
    const focusableElements = Array.from(
      document.querySelectorAll(this.focusableElements)
    ).filter((el) => !el.disabled && el.offsetParent !== null);

    this.currentFocusIndex =
      (this.currentFocusIndex + direction + focusableElements.length) %
      focusableElements.length;
    const targetElement = focusableElements[this.currentFocusIndex];
    targetElement.focus();
    this.speakText(this.getElementDescription(targetElement));
    this.addFocusIndicator(targetElement);
  },

  activateCurrentElement() {
    const element = document.activeElement;
    if (element.click) {
      element.click();
    } else if (element.type === "checkbox") {
      element.checked = !element.checked;
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },

  getElementDescription(element) {
    let text = "";
    if (element.getAttribute("aria-label")) {
      text = element.getAttribute("aria-label");
    } else if (element.title) {
      text = element.title;
    } else if (element.placeholder) {
      text = `Input dengan placeholder: ${element.placeholder}`;
    } else if (element.textContent.trim()) {
      text = element.textContent.trim();
    } else {
      text = `${element.tagName.toLowerCase()} yang tidak berlabel`;
    }
    return text;
  },

  speakText(text) {
    if (!this.isEnabled || !this.speechSynth) return;

    this.speechSynth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "id-ID";
    this.speechSynth.speak(utterance);
  },

  addFocusIndicator(element) {
    const focusedElements = document.querySelectorAll(".focused");
    focusedElements.forEach((el) => el.classList.remove("focused"));
    element.classList.add("focused");
  },
};

document.addEventListener("DOMContentLoaded", () => accessibility.init());

export default accessibility;

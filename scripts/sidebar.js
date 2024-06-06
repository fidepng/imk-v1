function initSidebar() {
  const settingBtn = document.querySelector(".setting-btn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const settingsIcon = document.querySelector(".settings-icon");

  if (!settingBtn || !sidebar || !overlay || !settingsIcon) {
    console.error(
      "Elemen tidak ditemukan. Sidebar tidak dapat diinisialisasi."
    );
    return;
  }

  settingBtn.addEventListener("click", toggleSidebar);

  function toggleSidebar() {
    const isExpanded = settingBtn.getAttribute("aria-expanded") === "true";
    settingBtn.setAttribute("aria-expanded", !isExpanded);
    sidebar.setAttribute("aria-hidden", isExpanded);
    sidebar.classList.toggle("open", !isExpanded);
    overlay.classList.toggle("show", !isExpanded);

    if (!isExpanded) {
      settingsIcon.classList.remove("rotate-close");
      settingsIcon.classList.add("rotate-open");
    } else {
      settingsIcon.classList.remove("rotate-open");
      settingsIcon.classList.add("rotate-close");
    }
  }

  document.addEventListener("click", (event) => {
    const isOutsideSidebar =
      !sidebar.contains(event.target) && !settingBtn.contains(event.target);
    if (isOutsideSidebar && sidebar.classList.contains("open")) {
      settingBtn.setAttribute("aria-expanded", "false");
      sidebar.setAttribute("aria-hidden", "true");
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
      settingsIcon.classList.remove("rotate-open");
      settingsIcon.classList.add("rotate-close");
    }
  });

  // Tambahkan penanganan peristiwa sentuh
  sidebar.addEventListener("touchstart", handleTouchStart, { passive: true });
  sidebar.addEventListener("touchmove", handleTouchMove, { passive: false });
  sidebar.addEventListener("touchend", handleTouchEnd);

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    if (!sidebar.classList.contains("open")) return;
    touchEndX = e.touches[0].clientX;
    const touchDiff = touchStartX - touchEndX;
    const sidebarWidth = sidebar.offsetWidth;

    if (touchDiff > 0 && touchDiff < sidebarWidth / 2) {
      sidebar.style.transform = `translateX(-${touchDiff}px)`;
    }
  }

  function handleTouchEnd() {
    if (!sidebar.classList.contains("open")) return;
    const touchDiff = touchStartX - touchEndX;
    const sidebarWidth = sidebar.offsetWidth;

    if (touchDiff > sidebarWidth / 3) {
      // Tutup sidebar
      settingBtn.setAttribute("aria-expanded", "false");
      sidebar.setAttribute("aria-hidden", "true");
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
      settingsIcon.classList.remove("rotate-open");
      settingsIcon.classList.add("rotate-close");
      sidebar.style.transform = "";
    } else {
      // Buka sidebar
      sidebar.style.transform = "";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebar();
});

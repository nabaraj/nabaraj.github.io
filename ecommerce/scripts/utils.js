document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNavigationClose = document.getElementById(
    "mobile-navigation-close"
  );
  const mobileNavigation = document.getElementById("responsive-navigation");

  hamburger.addEventListener("click", () => {
    mobileNavigation.classList.add("active");
  });
  mobileNavigationClose.addEventListener("click", () => {
    mobileNavigation.classList.remove("active");
  });

  // Mobile filter open
  const openFilterBtn = document.getElementById("openFilter");
  const filterSidebar = document.getElementById("mobileFilter");
  const closeFilterBtn = document.createElement("span");

  // Add a close button dynamically inside filter sidebar
  closeFilterBtn.innerHTML = "&times;";
  closeFilterBtn.classList.add("close-sidebar");
  filterSidebar.prepend(closeFilterBtn);

  // Open filter sidebar on mobile
  openFilterBtn.addEventListener("click", () => {
    filterSidebar.classList.add("active");
  });

  // Close filter sidebar on clicking the close button
  closeFilterBtn.addEventListener("click", () => {
    filterSidebar.classList.remove("active");
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (event) => {
    if (
      !filterSidebar.contains(event.target) &&
      !openFilterBtn.contains(event.target)
    ) {
      filterSidebar.classList.remove("active");
    }
  });
});

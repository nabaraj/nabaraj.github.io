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

 // Close Mobile Navigation & Filter Sidebar when clicking outside
 document.addEventListener("click", (event) => {
  if (
    !mobileNavigation.contains(event.target) &&
    !hamburger.contains(event.target)
  ) {
    mobileNavigation.classList.remove("active");
  }

  if (
    !filterSidebar.contains(event.target) &&
    !openFilterBtn.contains(event.target)
  ) {
    filterSidebar.classList.remove("active");
  }
});

// Prevent clicks inside mobile navigation from triggering the outside click
mobileNavigation.addEventListener("click", (event) => {
  event.stopPropagation();
});

// Prevent clicks inside filter sidebar from triggering the outside click
filterSidebar.addEventListener("click", (event) => {
  event.stopPropagation();
});
});

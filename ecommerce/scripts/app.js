const API_URL = "https://fakestoreapi.com/products";
const ITEMS_PER_PAGE = 10;

let allProducts = [];
let displayedProducts = [];
let currentPage = 1;
let activeFilters = { category: [], availability: true };
let priceRange = { min: 0, max: Infinity };
let searchQuery = "";
let sortOption = "default";

const loadMore = document.getElementById("load-more");
const sort = document.getElementById("sort");
const productCount = document.getElementById("productCount");

// Fetch data from API
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return { error: error.message };
  }
};

const updateProductCount = (length) => {
  productCount.innerText = `${length} Results`;
};

// Render products dynamically
const renderProducts = ({ products = [], error = null, isLoading = false }) => {
  const productGrid = document.getElementById("product-grid");

  if (isLoading) {
    productGrid.innerHTML = `<p class="error-message text-center w-full">Loading Products...</p>`;
    loadMore.classList.add("hidden");
    sort.classList.add("hidden");
    return;
  }

  if (error) {
    productGrid.innerHTML = `<p class="error-message text-center w-full">Error: ${error}</p>`;
    loadMore.classList.add("hidden");
    sort.classList.add("hidden");
    return;
  }

  if (!products || products.length === 0) {
    productGrid.innerHTML = `<p class="error-message text-center w-full">No products found.</p>`;
    loadMore.classList.add("hidden");
    sort.classList.add("hidden");
    updateProductCount(products.length);
    return;
  }

  updateProductCount(products.length);

  productGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card">
          <div class="product-image">
            <img src="${product.image}" loading="lazy" alt="${product.title}" >
          </div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-price">$${product.price}</p>
          <p class="product-description">${product.description.slice(
            0,
            100
          )}...</p>
          <p class="product-availability">${
            product.rating.count > 0 ? "In Stock" : "Out of Stock"
          }</p>
          <div class="product-like"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
  <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
</svg></div>
        </div>
      `
    )
    .join("");
};

// Generate filters dynamically
const generateFilters = () => {
  const filterContainer = document.getElementById("dynamic-filters");
  let maxPrice = 0;
  const categories = [
    ...new Set(
      allProducts.map((product) => {
        maxPrice = Math.ceil(Math.max(maxPrice, product.price));
        return product.category;
      })
    )
  ];

  filterContainer.innerHTML = `
    <h3 class="py-8 filters-label">Categories</h3>
    <div class="flex flex-wrap filters-lists border-b column">
      ${categories
        .map(
          (category) => `
      <label>
        <input type="checkbox" value="${category}" class="category-filter" />
        ${category.charAt(0).toUpperCase() + category.slice(1)}
      </label>
    `
        )
        .join("")}
    </div>
    <h3 class="py-8 filters-lebel">Price Range</h3>
    <div class="price-range flex">
      <label>
        Min: <input type="number" id="price-min" placeholder="0" min="0" />
      </label>
      <label>
        Max: <input type="number" id="price-max" placeholder="${
          maxPrice + 1000
        }" min="0" />
      </label>
    </div>
    <h3 class="py-8 filters-label">Availability</h3>
    <label>
      <input type="checkbox" id="availability-filter" checked />
      In Stock
    </label>
  `;

  // Add event listeners for filters
  document.querySelectorAll(".category-filter").forEach((checkbox) => {
    checkbox.addEventListener("change", handleCategoryFilterChange);
  });
  document
    .getElementById("price-min")
    .addEventListener("input", handlePriceRangeChange);
  document
    .getElementById("price-max")
    .addEventListener("input", handlePriceRangeChange);
  document
    .getElementById("availability-filter")
    .addEventListener("change", handleAvailabilityFilterChange);
};

// Apply filters and sorting, including search
const applyFilters = () => {
  let filteredProducts = allProducts;

  // Apply category filters
  if (activeFilters.category.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      activeFilters.category.includes(product.category)
    );
  }

  // Apply price range filter
  filteredProducts = filteredProducts.filter(
    (product) =>
      product.price >= priceRange.min && product.price <= priceRange.max
  );

  // Apply availability filter
  if (!activeFilters.availability) {
    filteredProducts = filteredProducts.filter(
      (product) => product.rating.count > 0
    );
  }

  // Apply search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  if (sortOption === "low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Paginate results
  displayedProducts = filteredProducts.slice(0, ITEMS_PER_PAGE * currentPage);
  sort.classList.remove("hidden");
  if (displayedProducts.length < filteredProducts.length) {
    loadMore.classList.remove("hidden");
  } else {
    loadMore.classList.add("hidden");
  }
  renderProducts({ products: displayedProducts });
};

// Handle search input change
const handleSearch = (event) => {
  searchQuery = event.target.value;
  currentPage = 1;
  applyFilters();
};

// Handle category filter change
const handleCategoryFilterChange = (event) => {
  const category = event.target.value;
  if (event.target.checked) {
    activeFilters.category.push(category);
  } else {
    activeFilters.category = activeFilters.category.filter(
      (item) => item !== category
    );
  }
  applyFilters();
};

// Handle price range change
const handlePriceRangeChange = () => {
  const minInput = document.getElementById("price-min").value;
  const maxInput = document.getElementById("price-max").value;

  priceRange.min = minInput ? parseFloat(minInput) : 0;
  priceRange.max = maxInput ? parseFloat(maxInput) : Infinity;
  applyFilters();
};

// Handle availability filter change
const handleAvailabilityFilterChange = (event) => {
  activeFilters.availability = event.target.checked;
  applyFilters();
};

// Handle sorting
const handleSortChange = (event) => {
  sortOption = event.target.value;
  applyFilters();
};

// Handle "Load More" button
const handleLoadMore = () => {
  currentPage += 1;
  applyFilters();
};

// Initialize the application
const init = async () => {
  renderProducts({ isLoading: true });
  const result = await fetchData(API_URL);
  if (result.error) {
    renderProducts({ error: result.error, isLoading: false });
  } else {
    allProducts = result;
    generateFilters();
    applyFilters();
  }
};

// Add event listeners
document.getElementById("search-bar").addEventListener("input", handleSearch);
document.getElementById("sort").addEventListener("change", handleSortChange);
loadMore.addEventListener("click", handleLoadMore);

// Run the application
init();

const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const itemsPerPage = 4;
let currentPage = 1;
let allProducts = [];
let filteredProducts = [];

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const category = searchInput.value.trim().toLowerCase();
    filterProductsByCategory(category);
});

const fetchProducts = async () => {
    const url = `https://fakestoreapi.com/products`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Product data fetch failed');

        allProducts = await response.json();
        filteredProducts = allProducts;
        currentPage = 1;
        renderPage(currentPage);
        updatePaginationButtons();
    } catch (error) {
        console.error('Error fetching product data:', error);
        alert('Failed to fetch product data. Please try again.');
    }
};

const filterProductsByCategory = (category) => {
    if (category) {
        filteredProducts = allProducts.filter(product => product.category.toLowerCase().includes(category));
    } else {
        filteredProducts = allProducts;
    }
    currentPage = 1;
    renderPage(currentPage);
    updatePaginationButtons();
};

const renderPage = (page) => {
    const dashboard = document.getElementById("dashboard");
    dashboard.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = 'product';

        const title = document.createElement("h3");
        title.textContent = product.title;
        productDiv.appendChild(title);

        const image = document.createElement("img");
        image.src = product.image;
        image.width = 200; 
        image.height = 150;
        productDiv.appendChild(image);

        const price = document.createElement("p");
        price.textContent = `Price: $${product.price}`;
        productDiv.appendChild(price);

       
        const category = document.createElement("p");
        category.textContent = `Category: ${product.category}`;
        productDiv.appendChild(category);

        const rating = document.createElement("p");
        rating.textContent = `Rating: ${product.rating.rate} (${product.rating.count} reviews)`;
        productDiv.appendChild(rating);

        const description = document.createElement("p");
        const viewDetailsButton = document.createElement("button");
        viewDetailsButton.textContent = 'View Details';
        viewDetailsButton.addEventListener('click', () => {
          
            description.textContent = product.description;
            productDiv.appendChild(description);
    
            
        });
        productDiv.appendChild(viewDetailsButton);

        dashboard.appendChild(productDiv);
    });
};

const updatePaginationButtons = () => {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage * itemsPerPage >= filteredProducts.length;
};

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        updatePaginationButtons();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage * itemsPerPage < filteredProducts.length) {
        currentPage++;
        renderPage(currentPage);
        updatePaginationButtons();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

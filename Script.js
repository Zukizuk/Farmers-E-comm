let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active'); 
    shoppingCart.classList.remove('active'); 
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let shoppingCart = document.querySelector('.cart');

document.querySelector('#cart-btn').onclick = () => {
    shoppingCart.classList.toggle('active'); 
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active'); 
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
}


let navbar = document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active'); 
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
}

var swiper = new Swiper(".product-slider", {
  loop:true,
    spaceBetween: 20,
    autoplay:{
        delay:7500,
        disableOnInteraction:false,
    },
    centeredSlides:true,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    768: {
      slidesPerView: 2,
    },
    1020: {
      slidesPerView: 3,
    },
  },
});

let cartItemCount = 0; // Initialize cart item count
let cartTotal = 0; // Initialize cart total
let isAddingItem = false; // Flag to prevent adding multiple items simultaneously

// Function to show a notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Function to update the count badge
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.style.display = cartItemCount > 0 ? 'block' : 'none';
    cartCountElement.innerText = cartItemCount.toString();
}

// Function to update the cart total
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    if (cartItemCount > 0) {
        cartTotalElement.style.display = 'block';
        cartTotalElement.innerText = `Total: ₵${cartTotal.toFixed(2)}`;
    } else {
        cartTotalElement.style.display = 'none';
    }
}

// Function to save the cart to localStorage
function saveCart() {
    if (cartItemCount > 0) {
        const cartItemsElement = document.getElementById('cart-items');
        const cartItems = Array.from(cartItemsElement.getElementsByClassName('cart-item')).map(item => {
            const name = item.querySelector('.cart-item-details div').innerText.split(' - ₵')[0];
            const price = parseFloat(item.querySelector('.cart-item-details div').innerText.split(' - ₵')[1]);
            const imageUrl = item.querySelector('img').src;
            const quantity = parseInt(item.querySelector('.cart-item-quantity').innerText.split('Quantity: ')[1]);
            return { name, price, imageUrl, quantity };
        });

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartItemCount', cartItemCount.toString());
        localStorage.setItem('cartTotal', cartTotal.toString());
    } else {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('cartItemCount');
        localStorage.removeItem('cartTotal');
    }
}


function loadCartFromLocalStorage() {
    try {
        const cartJSON = localStorage.getItem('cart');
        if (!cartJSON) {
            console.warn("No cart data found in localStorage");
            return;
        }

        const cart = JSON.parse(cartJSON);
        if (!cart || !Array.isArray(cart.items)) {
            throw new Error("Invalid cart format");
        }

        cart.items.forEach(item => addItemToCartUI(item));
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        // Optionally, you can display an error message to the user
        // displayErrorMessage("Failed to load cart. Please try again.");
    }
}



// Function to add a product to the cart
function addToCart(name, price, imageUrl, quantity = 1, save = true) {
    const cartItemsElement = document.getElementById('cart-items');
    const existingItem = Array.from(cartItemsElement.getElementsByClassName('cart-item')).find(item =>
        item.querySelector('.cart-item-details div').innerText.split(' - ₵')[0] === name
    );

    if (existingItem) {
        const quantityElement = existingItem.querySelector('.cart-item-quantity');
        const currentQuantity = parseInt(quantityElement.innerText.split('Quantity:')[1]);
        const newQuantity = currentQuantity + quantity;
        quantityElement.innerText = `Quantity: ${newQuantity}`;

        // Update cart item count and total
        cartItemCount += quantity;
        cartTotal += price * quantity;

        showNotification(`${name} quantity updated to ${newQuantity}`);
    } else {
        cartItemCount += quantity;
        cartTotal += price * quantity;

        const newItem = document.createElement('div');
        newItem.classList.add('cart-item');
        newItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="cart-item-image">
            <div class="cart-item-details">
                <div>${name} - ₵${price.toFixed(2)}</div>
                <div class="cart-item-quantity">Quantity: ${quantity}</div>
                <button class="remove-item-btn" onclick="removeCartItem(this, '${name}', ${price}, ${quantity})">Remove</button>
            </div>`;
        cartItemsElement.appendChild(newItem);

        showNotification(`${name} added to cart`);
    }

    updateCartCount();
    updateCartTotal();
    if (save) saveCart();
    isAddingItem = false;
}

// Function to remove a product from the cart
function removeCartItem(button, name, price, quantity) {
    const cartItem = button.parentNode.parentNode;
    const quantityElement = cartItem.querySelector('.cart-item-quantity');
    const currentQuantity = parseInt(quantityElement.innerText.split('Quantity:')[1]);

    if (currentQuantity > quantity) {
        const newQuantity = currentQuantity - quantity;
        quantityElement.innerText = `Quantity: ${newQuantity}`;
        cartItemCount -= quantity;
        cartTotal -= price * quantity;
    } else {
        cartItemCount -= currentQuantity;
        cartTotal -= price * currentQuantity;
        cartItem.parentNode.removeChild(cartItem);
    }

    updateCartCount();
    updateCartTotal();
    saveCart();
}

// Add event listener for clicking "add to cart" buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        if (isAddingItem) return;

        isAddingItem = true;
        const productElement = button.parentElement;
        const productName = productElement.querySelector('h3').innerText;
        const productPrice = parseFloat(productElement.querySelector('.price').innerText.replace('₵', ''));
        const productImage = productElement.querySelector('img').src;
        addToCart(productName, productPrice, productImage);
    });
});

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Function to handle search
function handleSearch() {
    const searchBox = document.getElementById('search-box');
    const products = document.querySelectorAll('.swiper-slide.box');
    const searchTerm = searchBox.value.trim().toLowerCase();

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();
        product.style.display = productName.includes(searchTerm) ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();

    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', debounce(handleSearch, 300));
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkout-btn').addEventListener('click', function() {
        window.location.href = 'checkoutPage.html'; // Change 'otherfile.html' to your desired file
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Function to load cart items from localStorage (assuming this function is defined elsewhere)
    loadCart();

    const searchBox = document.getElementById('search-box');
    const products = document.querySelectorAll('.card');

    // Event listener for search box input
    searchBox.addEventListener('input', function () {
        const searchTerm = searchBox.value.trim().toLowerCase();

        // Loop through each product to check if it matches the search term
        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();

            if (productName.includes(searchTerm)) {
                product.classList.remove('hidden'); // Show the product if it matches
            } else {
                product.classList.add('hidden'); // Hide the product if it doesn't match
            }
        });
    });
});



// JavaScript to manipulate the icon
document.addEventListener('DOMContentLoaded', function() {
    // Find the element with the class fa-chevron-up
    var chevronIcon = document.querySelector('.fa-chevron-up');
    // Example: Change color to red
    chevronIcon.style.color = 'red';
});



// scripts.js
document.addEventListener('DOMContentLoaded', function () {
    // Function to load cart items from localStorage (assuming the cart data structure)
    function loadCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemsElement = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total');
        let total = 0;

        cartItemsElement.innerHTML = '';

        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span><span>₵${item.price.toFixed(2)}</span>`;
            cartItemsElement.appendChild(li);
            total += item.price;
        });

        totalPriceElement.textContent = `₵${total.toFixed(2)}`;
    }

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        const checkoutForm = document.getElementById('checkout-form');
        const paymentForm = document.getElementById('payment-form');

        const customerInfo = {
            name: checkoutForm.name.value,
            email: checkoutForm.email.value,
            address: checkoutForm.address.value,
            city: checkoutForm.city.value,
            country: checkoutForm.country.value,
            zip: checkoutForm.zip.value,
        };

        const paymentInfo = {
            cardNumber: paymentForm['card-number'].value,
            expiryDate: paymentForm['expiry-date'].value,
            cvv: paymentForm.cvv.value,
        };

        console.log('Customer Info:', customerInfo);
        console.log('Payment Info:', paymentInfo);

        // Here, you would typically send the data to the server
        alert('Order placed successfully!');
    }

    loadCart();

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', handleFormSubmit);
});

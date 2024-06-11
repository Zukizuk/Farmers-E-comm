// Function to add product to cart
function addToCart(productName, productPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: productName, price: productPrice });
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display cart items on cart.html
function displayCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        let itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name} - ₵${item.price}`;
        cartItemsDiv.appendChild(itemDiv);
    });
}

// Call displayCart when cart.html is loaded
document.addEventListener('DOMContentLoaded', displayCart);

// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to Cart Function
function addToCart(productName, price) {
    const cartItem = cart.find(item => item.name === productName);
    
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${productName} added to cart!`);
}

// Remove from Cart Function
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    saveCart();
    updateCartUI();
}

// Update Quantity Function
function updateQuantity(productName, change) {
    const cartItem = cart.find(item => item.name === productName);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productName);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Clear cart items display
    cartItemsDiv.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    // Display cart items
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemHTML = `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R${item.price} each</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
            </div>
        `;
        cartItemsDiv.innerHTML += cartItemHTML;
    });
    
    cartTotal.textContent = total;
}

// Toggle Cart Modal
function toggleCart(event) {
    if (event) {
        event.preventDefault();
    }
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
    updateCartUI();
}

// Close cart modal when clicking outside
document.addEventListener('click', function(event) {
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartModal.contains(event.target) && !cartIcon.contains(event.target)) {
        cartModal.classList.remove('active');
    }
});

// Checkout Function - Send order via WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const phoneNumber = "27738314327";
    let message = "Hello! 👋\n\nI would like to place an order:\n\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name} x${item.quantity} - R${itemTotal}\n`;
    });
    
    message += `\nTotal: R${total}\n\nPlease confirm availability and delivery details.\nThank you!`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, "_blank");
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
    showNotification('Order sent to WhatsApp! 🎉');
}

// Show Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInUp 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInDown 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Handle Contact Form Submission
function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    showNotification('Thank you for your message! We will contact you soon. 😊');
    form.reset();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    
    // Smooth scroll links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#home') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
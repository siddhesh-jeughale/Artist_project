document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const currentPage = window.location.pathname.split('/').pop();
            
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('href').split('/').pop();
                
                if (linkPage === currentPage){
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
                
                link.addEventListener('click', function() {
                    navLinks.forEach(item => item.classList.remove('active'));
                    this.classList.add('active');
                });
            });
        });


        


                // <----------------------gallery---------------->
         document.addEventListener('DOMContentLoaded', function () {
            // Selectors
            const filterButtons = document.querySelectorAll('.filter-btn');
            const yearButtons = document.querySelectorAll('.year-btn');
            const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
            const loadMoreBtn = document.querySelector('.load-more-btn');

            let currentFilter = 'all';
            let currentYear = 'all';

            // Filter Function
            function filterGallery() {
                galleryItems.forEach(item => {
                    const categories = item.getAttribute('data-category');
                    const year = item.getAttribute('data-year');

                    const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
                    const matchesYear = currentYear === 'all' || year === currentYear;

                    if (matchesCategory && matchesYear) {
                        item.style.display = 'block';
                        item.classList.add('fade-in'); // Re-trigger animation
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            }

            // Button Event Listeners
            filterButtons.forEach(button => {
                button.addEventListener('click', function () {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    currentFilter = this.getAttribute('data-filter');
                    filterGallery();
                });
            });

            yearButtons.forEach(button => {
                button.addEventListener('click', function () {
                    yearButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    currentYear = this.getAttribute('data-year');
                    filterGallery();
                });
            });

            // Load More Logic (Simulation)
            loadMoreBtn.addEventListener('click', function () {
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
                this.disabled = true;

                setTimeout(() => {
                    alert('This is a demo. In a real site, more artworks would load from the database!');
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 1500);
            });

            // Initial Run
            filterGallery();
        });        



            // <----------------------shop-------------------->
        document.addEventListener('DOMContentLoaded', function () {
            // -- Data Stores --
            let cart = JSON.parse(localStorage.getItem('artCart')) || {};
            let wishlist = JSON.parse(localStorage.getItem('artWishlist')) || [];

            // -- Update UI Functions --
            function updateCartCount() {
                let totalItems = 0;
                for (let item in cart) totalItems += cart[item].quantity;
                document.querySelector('.cart-count').textContent = totalItems;
            }

            function updateWishlistButtons() {
                document.querySelectorAll('.wishlist-btn').forEach(btn => {
                    const itemId = btn.getAttribute('data-item');
                    const heartIcon = btn.querySelector('i');
                    if (wishlist.includes(itemId)) {
                        btn.classList.add('active');
                        heartIcon.classList.remove('bi-heart');
                        heartIcon.classList.add('bi-heart-fill');
                    } else {
                        btn.classList.remove('active');
                        heartIcon.classList.remove('bi-heart-fill');
                        heartIcon.classList.add('bi-heart');
                    }
                });
            }

            function updateCartModal() {
                const container = document.getElementById('cartItems');
                let subtotal = 0;

                if (Object.keys(cart).length === 0) {
                    container.innerHTML = '<p class="text-center text-muted py-4">Your cart is empty.</p>';
                } else {
                    container.innerHTML = '';
                    for (let itemId in cart) {
                        const item = cart[itemId];
                        const itemTotal = item.price * item.quantity;
                        subtotal += itemTotal;

                        container.innerHTML += `
                            <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                                <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
                                <div style="flex: 1;">
                                    <h6 class="mb-0">${item.name}</h6>
                                    <small class="text-muted">${item.type}</small>
                                    <div class="d-flex align-items-center mt-2">
                                        <button class="btn btn-sm btn-light border rounded-circle p-0" style="width:24px;height:24px;" onclick="changeCartQty('${itemId}', -1)">-</button>
                                        <span class="mx-2 small">${item.quantity}</span>
                                        <button class="btn btn-sm btn-light border rounded-circle p-0" style="width:24px;height:24px;" onclick="changeCartQty('${itemId}', 1)">+</button>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <div class="fw-bold">₹${itemTotal}</div>
                                    <button class="btn btn-link text-danger p-0 small text-decoration-none" onclick="removeFromCart('${itemId}')">Remove</button>
                                </div>
                            </div>
                        `;
                    }
                }
                document.getElementById('cartSubtotal').textContent = `₹${subtotal}`;
                document.getElementById('cartTotal').textContent = `₹${subtotal}`;
            }

            // -- Event Listeners --

            // 1. Add to Cart
            document.querySelectorAll('.add-to-cart').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-item');
                    const price = parseFloat(this.getAttribute('data-price'));
                    const qtySpan = document.querySelector(`.quantity[data-item="${id}"]`);
                    const quantity = parseInt(qtySpan.textContent);
                    const card = this.closest('.shop-item');
                    const name = card.querySelector('h4').textContent;
                    const image = card.querySelector('img').src;
                    const type = card.querySelector('.art-card-badge').textContent;

                    if(cart[id]) {
                        cart[id].quantity += quantity;
                    } else {
                        cart[id] = { name, price, quantity, image, type };
                    }

                    localStorage.setItem('artCart', JSON.stringify(cart));
                    updateCartCount();
                    showNotification(`Added ${quantity} ${name} to cart`);
                    qtySpan.textContent = 1; // Reset display
                });
            });

            // 2. Page Quantity Selectors
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-item');
                    const span = document.querySelector(`.quantity[data-item="${id}"]`);
                    let val = parseInt(span.textContent);
                    if (this.classList.contains('plus')) val++;
                    else if (val > 1) val--;
                    span.textContent = val;
                });
            });

            // 3. Wishlist
            document.querySelectorAll('.wishlist-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-item');
                    if(wishlist.includes(id)) {
                        wishlist = wishlist.filter(x => x !== id);
                        showNotification("Removed from wishlist");
                    } else {
                        wishlist.push(id);
                        showNotification("Added to wishlist");
                    }
                    localStorage.setItem('artWishlist', JSON.stringify(wishlist));
                    updateWishlistButtons();
                });
            });

            // 4. Filters
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    
                    document.querySelectorAll('.shop-item-container').forEach(item => {
                        const cat = item.getAttribute('data-category');
                        const soldOut = item.querySelector('.sold-out-overlay');
                        
                        let show = false;
                        if (filter === 'all') show = true;
                        else if (filter === 'available') show = !soldOut;
                        else if (filter === cat) show = true;

                        item.style.display = show ? 'block' : 'none';
                        if(show) item.querySelector('.shop-item').classList.add('fade-in');
                    });
                });
            });

            // 5. Sorting
            document.getElementById('sortSelect').addEventListener('change', function() {
                const sortBy = this.value;
                const container = document.getElementById('shopItems');
                const items = Array.from(container.querySelectorAll('.shop-item-container'));

                items.sort((a, b) => {
                    const pA = parseFloat(a.getAttribute('data-price'));
                    const pB = parseFloat(b.getAttribute('data-price'));
                    const dA = parseInt(a.getAttribute('data-date'));
                    const dB = parseInt(b.getAttribute('data-date'));

                    if (sortBy === 'price-low') return pA - pB;
                    if (sortBy === 'price-high') return pB - pA;
                    if (sortBy === 'newest') return dB - dA;
                    return 0; // Featured (DOM order)
                });

                items.forEach(item => container.appendChild(item));
            });

            // -- Modal Logic --
            window.changeCartQty = function(id, change) {
                if (cart[id]) {
                    cart[id].quantity += change;
                    if (cart[id].quantity < 1) delete cart[id];
                    localStorage.setItem('artCart', JSON.stringify(cart));
                    updateCartCount();
                    updateCartModal();
                }
            };

            window.removeFromCart = function(id) {
                delete cart[id];
                localStorage.setItem('artCart', JSON.stringify(cart));
                updateCartCount();
                updateCartModal();
            };

            document.getElementById('cartSummary').onclick = () => {
                updateCartModal();
                document.getElementById('cartModal').style.display = 'block';
                document.getElementById('cartOverlay').style.display = 'block';
            };

            const closeCart = () => {
                document.getElementById('cartModal').style.display = 'none';
                document.getElementById('cartOverlay').style.display = 'none';
            };

            document.getElementById('closeCart').onclick = closeCart;
            document.getElementById('cartOverlay').onclick = closeCart;

            document.getElementById('checkoutBtn').onclick = () => {
                if(Object.keys(cart).length === 0) alert("Cart is empty");
                else {
                    alert("Proceeding to checkout demo...");
                    cart = {};
                    localStorage.setItem('artCart', JSON.stringify(cart));
                    updateCartCount();
                    closeCart();
                }
            };

            // Helper: Notification
            function showNotification(msg) {
                const n = document.createElement('div');
                n.textContent = msg;
                n.style.cssText = `
                    position: fixed; top: 100px; right: 20px; background: var(--dark-color); color: white;
                    padding: 10px 20px; border-radius: 8px; z-index: 9999; animation: fadeInUp 0.3s;
                `;
                document.body.appendChild(n);
                setTimeout(() => n.remove(), 3000);
            }

            // Init
            updateCartCount();
            updateWishlistButtons();
        });



            // <-------------------contact------------------>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get button
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                // Loading state
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
                btn.disabled = true;

                // Simulate sending
                setTimeout(() => {
                    // Success state
                    btn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Message Sent!';
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-success');
                    
                    form.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.classList.remove('btn-success');
                        btn.classList.add('btn-primary');
                        btn.disabled = false;
                    }, 3000);
                }, 1500);
            });
        });   
        
// <-----------admin panel-------->
 function switchTab(tabName) {
            document.querySelectorAll('.nav-link-admin').forEach(link => link.classList.remove('active'));
            event.currentTarget.classList.add('active');
            document.querySelectorAll('.main-content > .tab-content').forEach(content => content.classList.add('d-none'));
            const selectedContent = document.getElementById(tabName + '-tab');
            if (selectedContent) {
                selectedContent.classList.remove('d-none');
                const titles = {
                    'dashboard': 'Overview',
                    'pages': 'Manage Site Content',
                    'artworks': 'Manage Artworks',
                    'orders': 'Order History',
                    'messages': 'Messages'
                };
                document.getElementById('pageTitle').textContent = titles[tabName] || 'Overview';
            }
        }

        const toggleBtn = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        toggleBtn.addEventListener('click', () => { sidebar.classList.toggle('active'); });
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
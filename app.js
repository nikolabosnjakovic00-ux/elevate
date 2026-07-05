// --- Global Data Store & Model Photography Asset Mapping ---
const categories = ['men', 'women', 'kids'];
const clothesTypes = ['T-Shirt', 'Jumper', 'Sweatshirt', 'Trainers', 'Overshirt'];
const itemSizes = ['XS', 'S', 'M', 'L', 'XL'];

// Premium fashion design colorways with individual distinct high-resolution model shots
const pastelPalettes = [
    { name: 'Soft Sage', hex: '#E8ECE9', imgUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80' },
    { name: 'Champagne Pink', hex: '#F3E8EB', imgUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Muted Sky Blue', hex: '#E6ECFF', imgUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Oatmeal Chalk', hex: '#F7EFE5', imgUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80' }
];

let mockProducts = [];
let cartState = [];
let checkoutData = {};

// Setup clean functional dataset mapping custom images variant properties to every category page item
function initializeCatalog() {
    let indexId = 1;
    categories.forEach(cat => {
        clothesTypes.forEach((type, typeIdx) => {
            // Build up 7 items per product classification type to provide comprehensive catalogs across sections
            for(let variant = 1; variant <= 7; variant++) {
                const isSales = indexId % 4 === 0;
                const basePrice = 55 + (typeIdx * 20) + (variant * 4);
                
                // Customize model photos specifically based on gender filter configurations
                let adjustedPalettes = pastelPalettes.map((palette, pIdx) => {
                    let specificModelImg = palette.imgUrl;
                    if (cat === 'women') {
                        const femaleModels = [
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80'
                        ];
                        specificModelImg = femaleModels[pIdx];
                    } else if (cat === 'kids') {
                        const kidsModels = [
                            'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1540475820923-f7472688d6a3?auto=format&fit=crop&w=600&q=80'
                        ];
                        specificModelImg = kidsModels[pIdx];
                    } else { // Men
                        const menModels = [
                            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
                            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
                        ];
                        specificModelImg = menModels[pIdx];
                    }
                    
                    return {
                        name: palette.name,
                        hex: palette.hex,
                        imgUrl: specificModelImg
                    };
                });

                mockProducts.push({
                    id: indexId++,
                    category: cat,
                    name: `ELEVATE Studio ${type} ${String.fromCharCode(64 + variant)}`,
                    type: type,
                    price: basePrice,
                    salePrice: isSales ? Math.floor(basePrice * 0.75) : null,
                    palettes: adjustedPalettes,
                    sizes: itemSizes,
                    description: `An exquisite luxury essential tailored meticulously to provide premium architectural frame lines, perfect for contemporary elevated style profiles across all age demographics.`
                });
            }
        });
    });
}
initializeCatalog();

// --- Routing Engine ---
function navigateTo(targetView, data = null) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainNode = document.getElementById('main-content');
    
    switch(targetView) {
        case 'home':
            renderHome(mainNode);
            break;
        case 'men':
        case 'women':
        case 'kids':
            renderCategoryPage(mainNode, targetView);
            break;
        case 'collections':
            renderCategoryPage(mainNode, 'collections', 'Seasonal Lookbook Collections');
            break;
        case 'sales':
            renderCategoryPage(mainNode, 'sales', 'Archive Markdown Sale');
            break;
        case 'product-view':
            renderDetailedProduct(mainNode, data);
            break;
        case 'cart':
            renderCartPage(mainNode);
            break;
        case 'checkout-billing':
            renderCheckoutBilling(mainNode);
            break;
        case 'checkout-payment':
            renderCheckoutPayment(mainNode);
            break;
        case 'order-success':
            renderOrderSuccess(mainNode);
            break;
        case 'info':
            renderInfoPage(mainNode);
            break;
        case 'auth':
            renderAuthPage(mainNode);
            break;
    }
}

// --- View Rendering Engine Functions ---

function renderHome(container) {
    let html = `
        <div class="hero">
            <div class="hero-content">
                <h1>ELEVATE</h1>
                <p>Minimalist Architectural Outfitting For Men, Women, & Kids</p>
            </div>
        </div>
    `;

    categories.forEach(cat => {
        html += `<h2 class="section-title">Shop ${cat.toUpperCase()} Essentials</h2><div class="products-grid">`;
        // Limit main page display strictly to exactly 5 products per user criteria
        const homeDisplayItems = mockProducts.filter(p => p.category === cat).slice(0, 5);
        homeDisplayItems.forEach(p => {
            html += createProductCardTemplate(p);
        });
        html += `</div>`;
    });

    container.innerHTML = html;
}

let loadedCount = 20; 
function renderCategoryPage(container, typeFilter, customsTitle = null) {
    loadedCount = 20; 
    let filteredList = [];
    
    if(typeFilter === 'sales') {
        filteredList = mockProducts.filter(p => p.salePrice !== null);
    } else if(typeFilter === 'collections') {
        filteredList = mockProducts.filter(p => p.id % 3 === 0);
    } else {
        filteredList = mockProducts.filter(p => p.category === typeFilter);
    }

    const pageTitle = customsTitle || `${typeFilter}'s Catalog Collection`;

    function buildGridSegment() {
        let itemsHtml = `<h2 class="section-title">${pageTitle}</h2><div class="products-grid">`;
        const viewSlice = filteredList.slice(0, loadedCount);
        viewSlice.forEach(p => { itemsHtml += createProductCardTemplate(p); });
        itemsHtml += `</div>`;

        if(loadedCount < filteredList.length) {
            itemsHtml += `
                <div class="load-more-container">
                    <button class="btn-modern" id="load-more-action">Load More Products</button>
                </div>
            `;
        }
        container.innerHTML = itemsHtml;

        const actionBtn = document.getElementById('load-more-action');
        if(actionBtn) {
            actionBtn.addEventListener('click', () => {
                loadedCount += 20;
                buildGridSegment();
            });
        }
    }
    buildGridSegment();
}

function createProductCardTemplate(p) {
    const defaultColorVariant = p.palettes[0];
    const finalPrice = p.salePrice ? `<span style="text-decoration:line-through; color:var(--text-muted); font-size:0.9rem; margin-right:10px;">€${p.price}</span>€${p.salePrice}` : `€${p.price}`;
    
    // Tiny inline swatches displayed underneath model photographs
    const swatchCircles = p.palettes.map(pal => `
        <div class="card-swatch" style="background-color: ${pal.hex};"></div>
    `).join('');

    return `
        <div class="product-card" onclick="navigateTo('product-view', ${p.id})">
            <div class="product-img-wrapper" style="background-color: ${defaultColorVariant.hex};">
                <img src="${defaultColorVariant.imgUrl}" alt="${p.name}">
            </div>
            <h3>${p.name}</h3>
            <div class="product-price">${finalPrice}</div>
            <div class="card-swatches">${swatchCircles}</div>
        </div>
    `;
}

function renderDetailedProduct(container, productId) {
    const p = mockProducts.find(item => item.id === productId);
    let currentVariant = p.palettes[0];
    let selectedSize = p.sizes[2]; // Default to M size

    function renderDynamicView() {
        const activePrice = p.salePrice ? p.salePrice : p.price;
        container.innerHTML = `
            <div class="product-view-container">
                <div class="product-view-gallery" id="product-display-canvas" style="background-color: ${currentVariant.hex}; transition: var(--transition-smooth);">
                    <img id="variant-photo" src="${currentVariant.imgUrl}" alt="${p.name}">
                </div>
                <div class="product-view-details">
                    <h2>${p.name}</h2>
                    <div class="price">€${activePrice}</div>
                    <p style="margin-bottom: 30px; color: var(--text-muted); line-height: 1.7;">${p.description}</p>
                    
                    <div class="selectors-group">
                        <label>Color Tone: <strong>${currentVariant.name}</strong></label>
                        <div class="selector-options">
                            ${p.palettes.map(c => `
                                <button class="color-circle-btn ${c.name === currentVariant.name ? 'active' : ''}" 
                                        data-name="${c.name}" 
                                        style="background-color: ${c.hex};">
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="selectors-group">
                        <label>Select Size: <strong>${selectedSize}</strong></label>
                        <div class="selector-options">
                            ${p.sizes.map(s => `<button class="selector-btn size-opt ${s === selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>`).join('')}
                        </div>
                    </div>

                    <button class="btn-modern" id="add-to-bag-cta" style="width: 100%; margin-top: 20px;">Add To Bag</button>
                </div>
            </div>
        `;

        // Interactive Choice Listeners - Updates photograph matching the chosen color way instantly
        document.querySelectorAll('.color-circle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetName = e.target.getAttribute('data-name');
                currentVariant = p.palettes.find(pal => pal.name === targetName);
                renderDynamicView();
            });
        });

        document.querySelectorAll('.size-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                selectedSize = e.target.getAttribute('data-size');
                renderDynamicView();
            });
        });

        document.getElementById('add-to-bag-cta').addEventListener('click', () => {
            cartState.push({
                product: p,
                size: selectedSize,
                color: currentVariant.name,
                hex: currentVariant.hex,
                image: currentVariant.imgUrl,
                computedPrice: activePrice
            });
            updateCartIconBadge();
            navigateTo('cart');
        });
    }
    renderDynamicView();
}

// --- Cart and Checkout System Core Engine ---
function renderCartPage(container) {
    if(cartState.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 100px 20px;">
                <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 20px; color: var(--text-muted);"></i>
                <h2>Your Bag is Currently Empty</h2>
                <button class="btn-modern" onclick="navigateTo('home')" style="margin-top:20px;">Explore Products</button>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    let itemsHtml = '';
    cartState.forEach((item, idx) => {
        subtotal += item.computedPrice;
        itemsHtml += `
            <div class="cart-item-row">
                <div class="cart-item-img" style="background:${item.hex};">
                    <img src="${item.image}" alt="">
                </div>
                <div class="cart-item-info">
                    <h4>${item.product.name}</h4>
                    <p style="font-size:0.85rem; color: var(--text-muted);">Size: ${item.size} | Color: ${item.color}</p>
                </div>
                <div style="font-weight: 600;">€${item.computedPrice}</div>
                <div style="cursor:pointer; color: var(--text-muted); padding-left: 15px;" onclick="removeItemFromCart(${idx})"><i class="fa-regular fa-trash-can"></i></div>
            </div>
        `;
    });

    const shipping = subtotal > 150 ? 0 : 15;
    const totalAmount = subtotal + shipping;

    container.innerHTML = `
        <h2 class="section-title">Your Bag Selection</h2>
        <div class="cart-split-layout">
            <div>${itemsHtml}</div>
            <div>
                <div class="cart-summary-box">
                    <h3>Order Overview</h3>
                    <div class="summary-row" style="margin-top:20px;"><span>Subtotal</span><span>€${subtotal}</span></div>
                    <div class="summary-row"><span>Estimated Shipping</span><span>${shipping === 0 ? 'FREE' : '€'+shipping}</span></div>
                    <div class="summary-row summary-total"><span>Total Amount</span><span>€${totalAmount}</span></div>
                    <button class="btn-modern" style="width:100%; margin-top:20px;" onclick="navigateTo('checkout-billing')">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    `;
}

function renderCheckoutBilling(container) {
    container.innerHTML = `
        <h2 class="section-title">Shipping Address Info</h2>
        <div class="cart-split-layout" style="grid-template-columns: 1.5fr 1fr;">
            <form id="billing-data-form" onsubmit="captureBilling(event)">
                <div class="form-group"><label>Full Legal Name</label><input type="text" class="form-control" required value="${checkoutData.name || ''}" id="bill-name"></div>
                <div class="form-group"><label>Email Delivery Address</label><input type="email" class="form-control" required value="${checkoutData.email || ''}" id="bill-email"></div>
                <div class="form-group"><label>Street Address</label><input type="text" class="form-control" required value="${checkoutData.address || ''}" id="bill-address"></div>
                <div class="form-style-row" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div class="form-group"><label>Postal Code</label><input type="text" class="form-control" required value="${checkoutData.zip || ''}" id="bill-zip"></div>
                    <div class="form-group"><label>City</label><input type="text" class="form-control" required value="${checkoutData.city || ''}" id="bill-city"></div>
                </div>
                <div class="form-group"><label>Contact Phone</label><input type="tel" class="form-control" required value="${checkoutData.phone || ''}" id="bill-phone"></div>
                <button type="submit" class="btn-modern" style="width:100%;">Continue to Payment</button>
            </form>
            <div>
                <div class="cart-summary-box" style="background: var(--border-light);">
                    <h4>Invoice Protocol</h4>
                    <p style="font-size:0.85rem; margin-top:10px; color:var(--text-main); line-height: 1.6;">Your official order invoice breakdown will be systematically delivered directly to the exact email address typed into the form field box on the left.</p>
                </div>
            </div>
        </div>
    `;
}

function captureBilling(e) {
    e.preventDefault();
    checkoutData.name = document.getElementById('bill-name').value;
    checkoutData.email = document.getElementById('bill-email').value;
    checkoutData.address = document.getElementById('bill-address').value;
    checkoutData.zip = document.getElementById('bill-zip').value;
    checkoutData.city = document.getElementById('bill-city').value;
    checkoutData.phone = document.getElementById('bill-phone').value;
    navigateTo('checkout-payment');
}

function renderCheckoutPayment(container) {
    let chosenMethod = 'Credit Card';
    
    function renderPaymentContent() {
        container.innerHTML = `
            <h2 class="section-title">Finalize Settlement Gateway</h2>
            <div class="cart-split-layout" style="grid-template-columns: 1.5fr 1fr;">
                <div>
                    <label style="display:block; font-size:0.8rem; margin-bottom:10px; text-transform:uppercase;">Paying Method</label>
                    <div class="payment-grid">
                        <div class="payment-card-option ${chosenMethod === 'Credit Card' ? 'active' : ''}" data-method="Credit Card"><i class="fa-regular fa-credit-card"></i> Credit Card</div>
                        <div class="payment-card-option ${chosenMethod === 'PayPal' ? 'active' : ''}" data-method="PayPal"><i class="fa-brands fa-paypal"></i> PayPal</div>
                        <div class="payment-card-option ${chosenMethod === 'iDEAL' ? 'active' : ''}" data-method="iDEAL"><i class="fa-solid fa-building-columns"></i> iDEAL</div>
                        <div class="payment-card-option ${chosenMethod === 'Bank Card' ? 'active' : ''}" data-method="Bank Card"><i class="fa-solid fa-money-check-dollar"></i> Bank Card</div>
                    </div>
                    
                    <div id="dynamic-payment-fields"></div>
                    
                    <button class="btn-modern" id="finalize-order-cta" style="width:100%; margin-top:25px;">Finalize Order</button>
                </div>
                <div>
                    <div class="cart-summary-box">
                        <h3>Despatch Target Address</h3>
                        <p style="font-size:0.9rem; margin-top:15px; color: var(--text-muted); line-height:1.6;">
                            <strong>${checkoutData.name}</strong><br>
                            ${checkoutData.address}<br>
                            ${checkoutData.zip}, ${checkoutData.city}<br>
                            ${checkoutData.email}
                        </p>
                    </div>
                </div>
            </div>
        `;

        document.querySelectorAll('.payment-card-option').forEach(card => {
            card.addEventListener('click', (e) => {
                chosenMethod = e.currentTarget.getAttribute('data-method');
                renderPaymentContent();
            });
        });

        const targetFields = document.getElementById('dynamic-payment-fields');
        if(chosenMethod === 'Credit Card' || chosenMethod === 'Bank Card') {
            targetFields.innerHTML = `
                <div class="form-group"><label>Card Number</label><input type="text" class="form-control" placeholder="0000 0000 0000 0000"></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    <div class="form-group"><label>Expiration Date</label><input type="text" class="form-control" placeholder="MM/YY"></div>
                    <div class="form-group"><label>CVV</label><input type="text" class="form-control" placeholder="000"></div>
                </div>
            `;
        } else {
            targetFields.innerHTML = `<p style="padding: 20px; background: #FFFFFF; border: 1px dashed var(--accent); color: var(--text-muted);">You will be securely redirected to the external ${chosenMethod} transaction environment.</p>`;
        }

        document.getElementById('finalize-order-cta').addEventListener('click', () => {
            navigateTo('order-success');
        });
    }
    renderPaymentContent();
}

function renderOrderSuccess(container) {
    container.innerHTML = `
        <div style="text-align:center; padding: 100px 20px; max-width:600px; margin: 0 auto;">
            <div style="width:80px; height:80px; background:#E8ECE9; color:var(--text-main); border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 30px auto; font-size:2rem;">
                <i class="fa-solid fa-check"></i>
            </div>
            <h2 style="font-size:2.2rem; font-weight:300; margin-bottom:15px;">Order Completed</h2>
            <p style="color: var(--text-muted); line-height:1.8;">Thank you for shopping with ELEVATE. Your purchase transaction has processed successfully.</p>
            <p style="margin-top: 20px; font-weight: 500;">The invoice data summary has been sent to your email address at:<br><span style="color:var(--accent); text-decoration:underline;">${checkoutData.email}</span></p>
            <button class="btn-modern" onclick="clearCartAndHome()" style="margin-top:40px;">Return to Homepage</button>
        </div>
    `;
}

function renderInfoPage(container) {
    container.innerHTML = `
        <div class="info-container">
            <h2>The Architecture of ELEVATE</h2>
            <p>ELEVATE was founded under a singular design imperative: to strip away the noise of fast fashion trends and build a timeless, structural wardrobe that caters to all stages of life. We design modern silhouettes rooted in functional minimalism, crafted using clean organic materials and finished in an intentional palette of soothing architectural pastel tones.</p>
            <p>True modern fashion does not care about age. Our items are engineered to frame the individual, from expressive kids collections discovering initial identities, to minimalist contemporary young professionals, through to mature tastemakers who demand clean fabric integrity and comfort layout execution over brand labels.</p>
            <p>We build clothing for the discerning eye. We elevate the ordinary into structural essentials.</p>
        </div>
    `;
}

function renderAuthPage(container) {
    container.innerHTML = `
        <div style="max-width: 400px; margin: 60px auto; background: var(--white); padding: 40px; border: 1px solid var(--border-light);">
            <h2 style="text-align:center; font-weight:300; margin-bottom:30px; letter-spacing:0.1rem;">WELCOME TO ELEVATE</h2>
            <div class="form-group"><label>Email Address</label><input type="email" class="form-control"></div>
            <div class="form-group"><label>Password</label><input type="password" class="form-control"></div>
            <button class="btn-modern" style="width:100%; margin-top:10px;" onclick="navigateTo('home')">Sign In</button>
        </div>
    `;
}

// --- Global Auxiliary Handlers ---
function removeItemFromCart(index) {
    cartState.splice(index, 1);
    updateCartIconBadge();
    renderCartPage(document.getElementById('main-content'));
}

function updateCartIconBadge() {
    document.getElementById('cart-count').innerText = cartState.length;
}

function clearCartAndHome() {
    cartState = [];
    checkoutData = {};
    updateCartIconBadge();
    navigateTo('home');
}

// --- Responsive Menu Listeners ---
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('nav-menu').classList.add('open');
});
document.getElementById('close-menu-btn').addEventListener('click', () => {
    document.getElementById('nav-menu').classList.remove('open');
});
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-menu').classList.remove('open');
    });
});

// --- Framework Bootstrapper ---
document.addEventListener("DOMContentLoaded", () => {
    navigateTo('home');
});
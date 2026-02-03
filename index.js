// 1. DATA INITIALIZATION
let allProduct = [];
let totalPrice = localStorage.getItem("totalPrice") ? parseInt(localStorage.getItem("totalPrice")) : 0;
let totalProduct = localStorage.getItem("totalProduct") ? parseInt(localStorage.getItem("totalProduct")) : 0;
let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

// DOM Elements
const totalElement = document.getElementById("totalItemPrice");
const productContainer = document.querySelector(".best-seller-product");
const cartListElement = document.getElementById("cartListContainer");
const showButton = document.getElementById("showButton");

let isCartVisible = false;

// Fungsi pusat untuk menghitung harga akhir
function getFinalPrice(originalPrice, discountPercentage = 0, couponCode = "") {
    let discountAmount = 0;
    if (couponCode === "GG26") {
        discountAmount = originalPrice * (5 / 100);
    } else {
        discountAmount = originalPrice * (discountPercentage / 100);
    }
    return originalPrice - discountAmount;
}

// 1. Definisikan fungsi untuk mengambil data
async function loadProducts() {
    try {
        const response = await fetch('./data/produk.json');
        const products = await response.json();
        
        allProduct = products;
        
        displayProducts(allProduct);
        
    } catch (error) {
        console.error("Gagal mengambil data produk:", error);
    }
}

function displayProducts(dataProduk) {
    productContainer.innerHTML = ""; 
    
    dataProduk.forEach(barang => {
        const card = document.createElement("a");
        card.className = "product-container";
        card.href = "#";
        card.innerHTML = `
            <img src="./assets/img/${barang.image}" alt="${barang.name}">
            <h3>${barang.name}</h3>
            <p>Rp ${barang.price.toLocaleString('id-ID')}</p>
        `;
        
        // --- BAGIAN INI HARUS ADA DI DALAM FOREACH ---
        card.addEventListener("click", (e) => {
            e.preventDefault(); // Biar gak loncat ke atas halamannya
            addToCart(barang);  // Panggil fungsi tambah ke keranjang
            
            // Animasi feedback saat diklik
            card.style.transform = "scale(0.95)";
            setTimeout(() => {
                card.style.transform = "";
            }, 100);
        });
        // ----------------------------------------------

        productContainer.appendChild(card);
    });
}

// 2. FUNCTIONS (Logic)
function saveToStorage() {
    localStorage.setItem("totalPrice", totalPrice);
    localStorage.setItem("totalProduct", totalProduct);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateSummaryUI() {
    const freeOngkirLimit = 10000;
    const isFreeOngkir = totalPrice >= freeOngkirLimit;
    
    totalElement.style.color = isFreeOngkir ? "green" : "black";
    
    if (isFreeOngkir) {
        totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice >= 20000 ? getFinalPrice(totalPrice, 10).toLocaleString(`id-ID`) : totalPrice.toLocaleString(`id-ID`)} - Gratis ongkir!`;
    } else {
        const gap = freeOngkirLimit - totalPrice;
        totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice >= 20000 ? getFinalPrice(totalPrice, 10).toLocaleString(`id-ID`) : totalPrice.toLocaleString(`id-ID`)} (-Rp${gap.toLocaleString("id-ID")} lagi untuk Gratis ongkir)`;
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.product === product.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            product: product.name,
            price: product.price,
            quantity: 1
        });
    }

    totalPrice += product.price;
    totalProduct += 1;

    saveToStorage();
    updateSummaryUI();
    renderCart(); // <--- TAMBAHKAN INI agar daftar diupdate tiap kali klik produk
}

function removeFromCart(productName) {
    const itemIndex = cart.findIndex(item => item.product === productName);

    if (itemIndex !== -1) {
        totalPrice -= cart[itemIndex].price * cart[itemIndex].quantity;
        totalProduct -= cart[itemIndex].quantity;
        cart.splice(itemIndex, 1);

        saveToStorage();
        updateSummaryUI();
        renderCart(); // <--- TAMBAHKAN INI agar tampilan update setelah dihapus
    }
}

function renderCart() {
    cartListElement.innerHTML = "";
    
    if (cart.length === 0) {
        cartListElement.innerHTML = "<p>Keranjang kosong</p>";
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <span>${item.product} (x${item.quantity}) - Rp${(item.price * item.quantity).toLocaleString("id-ID")}</span>
            <button onclick="removeFromCart('${item.product}')">Hapus</button>
        `;
        cartListElement.appendChild(itemElement);
    });

    const grandTotal = document.createElement("h3");
    const couponContainer = document.createElement("div");
    const couponInput = document.createElement("input");
    const couponButton = document.createElement("button");
    couponContainer.className = "coupon-container";
    couponInput.className = "coupon-input";
    couponInput.id = "couponInput";
    couponInput.autocomplete = "off";
    couponButton.className = "coupon-button";
    couponButton.id = "couponButton";
    couponButton.innerText = "submit";
    cartListElement.appendChild(couponContainer);
    couponContainer.appendChild(couponInput);
    couponContainer.appendChild(couponButton);
    let finalPrice = totalPrice >= 20000 ? getFinalPrice(totalPrice, 10) : totalPrice;
    let coupon = false;
    couponButton.addEventListener("click", () => {
        if ( coupon == true) return;
        const couponInput = document.getElementById("couponInput");
        const couponInputValue = couponInput.value;
        if (couponInputValue === "GG26") {
            finalPrice = getFinalPrice(finalPrice, 0, "GG26");
            coupon = true;
            const discount = document.getElementById("discount");
            discount.innerText = totalPrice >= 20000 ? "Diskon 10% + 5%" : "Diskon 5%";
            grandTotal.innerText = `Grand Total: Rp${finalPrice}`;
            alert("Kode Berhasil Disubmit");
        } else {
            alert("Kode Coupon Yang Anda Masukkan Tidak Valid");
        }
    });
    if (totalPrice >= 20000) {
        const discountContainer = document.createElement("div");
        const discount = document.createElement("span");
        const originalPrice = document.createElement("h3");
        discountContainer.className = "discount-container";
        discountContainer.id = "discountContainer";
        originalPrice.innerText = `Grand Total: Rp${totalPrice.toLocaleString(`id-ID`)}`;
        originalPrice.className = "original-price";
        discount.id = "discount";
        discount.innerText = "Diskon 10%";
        discount.className = "discount-badge";
        cartListElement.appendChild(discountContainer);
        discountContainer.appendChild(originalPrice);
        discountContainer.appendChild(discount);
    }
    grandTotal.innerText = `Grand Total: Rp${finalPrice.toLocaleString('id-ID')}`;
    cartListElement.appendChild(grandTotal);

    // TAMBAHKAN INI: Tombol Checkout
    const checkoutBtn = document.createElement("button");
    checkoutBtn.innerText = "Selesaikan Pesanan 🛒";
    checkoutBtn.className = "checkout-button"; // Nanti kita beri gaya di CSS
    checkoutBtn.onclick = () => {
        alert(`Terima kasih sudah berbelanja! Total bayar: Rp${finalPrice.toLocaleString('id-ID')}`);
        
        // Kosongkan keranjang setelah belanja
        cart = [];
        totalPrice = 0;
        totalProduct = 0;
        saveToStorage();
        updateSummaryUI();
        renderCart();
    };
    cartListElement.appendChild(checkoutBtn);
}

// 3. EVENT LISTENERS
showButton.addEventListener("click", () => {
    isCartVisible = !isCartVisible;
    cartListElement.classList.toggle("active");
    showButton.innerText = isCartVisible ? "Sembunyikan" : "Tampilkan";
    
    // Hapus bagian "if (isCartVisible) renderCart();" karena sudah otomatis
});

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    
    // Filter produk berdasarkan apa yang diketik
    const filteredProducts = allProduct.filter(product => {
        return product.name.toLowerCase().includes(keyword);
    });

    if (filteredProducts.length === 0) {
        // Jika tidak ketemu
        productContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #7f8c8d;">
                <p>Yah, produk "${keyword}" tidak ditemukan... 🔍</p>
            </div>`;
    } else {
        // Jika ketemu, panggil fungsi display (Fitur klik ada di dalam sini!)
        displayProducts(filteredProducts);
    }
});

searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredProducts = allProduct.filter(product => {
        return product.name.toLowerCase().includes(keyword);
    });
    const searchContainer = document.querySelector(".search-container");
    const productSuggestion = document.getElementById("searchSuggestion");

    // Jika elemen yang diklik BUKAN bagian dari searchContainer
    if (!searchContainer.contains(e.target)) {
        productSuggestion.innerHTML = "";
    }
    if (filteredProducts.length === 0 || keyword === "") {
        productSuggestion.innerHTML = ``;
    } else {
        productSuggestion.innerHTML = "";
        filteredProducts.forEach(product => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "suggestion-item";
            suggestionItem.innerText = product.name;
            suggestionItem.addEventListener("click", () => {
                addToCart(product);
                searchInput.value = "";
                productSuggestion.innerHTML = "";
            });
            productSuggestion.appendChild(suggestionItem);
        });
    }
})

document.addEventListener("DOMContentLoaded", () => {
    // PENTING: Jalankan ini agar data muncul pertama kali saat web dibuka
    updateSummaryUI();
    loadProducts();
    renderCart();
})
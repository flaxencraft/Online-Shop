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

// 1. Definisikan fungsi untuk mengambil data
async function loadProducts() {
    try {
        const response = await fetch('produk.json');
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
            <img src="${barang.image}" alt="${barang.name}">
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
        totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice.toLocaleString(`id-ID`)} - Gratis ongkir!`;
    } else {
        const gap = freeOngkirLimit - totalPrice;
        totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice.toLocaleString(`id-ID`)} (-Rp${gap} lagi untuk Gratis ongkir)`;
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
            <span>${item.product} (x${item.quantity}) - Rp${item.price * item.quantity}</span>
            <button onclick="removeFromCart('${item.product}')">Hapus</button>
        `;
        cartListElement.appendChild(itemElement);
    });

    const grandTotal = document.createElement("h3");
    const discount = document.createElement("span");
    const finalPrice = totalPrice >= 20000 ? totalPrice - (totalPrice * 0.1) : totalPrice;
    if (totalPrice >= 20000) {
        discount.innerText = "Diskon 10%";
        cartListElement.appendChild(discount);
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

document.addEventListener("DOMContentLoaded", () => {
    // PENTING: Jalankan ini agar data muncul pertama kali saat web dibuka
    updateSummaryUI();
    loadProducts();
    renderCart();
})
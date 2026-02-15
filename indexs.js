
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbx1mHcVbmPXND71RxlKerCTxeq7_e6h0",
  authDomain: "betas-online-shop.firebaseapp.com",
  databaseURL: "https://betas-online-shop-default-rtdb.firebaseio.com",
  projectId: "betas-online-shop",
  storageBucket: "betas-online-shop.firebasestorage.app",
  messagingSenderId: "826617011517",
  appId: "1:826617011517:web:f3b0b1e8eec49285e4b954",
  measurementId: "G-DRHBYY7XNF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Hubungkan ke Realtime Database

// Global Var
let allProducts = [];
let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
let totalPrices = localStorage.getItem("totalPrice") ? parseInt(localStorage.getItem("totalPrice")) : 0;
let totalProducts = cart.length;
let codeProduct = ["K2020202"];

// Element
const bestSellerProductContainer = document.getElementById("bestSellerProductContainer");
const codeValid = document.getElementById("codeValid");
const reviewInput = document.getElementById("reviewInput");

// <====== Function ======>

/** Memuat Product dari JSON */
async function loadProducts() {
    try {
        await fetch("./data/product.json")
        .then(Response => Response.json())
        .then(products => {
            allProducts = products;
            displayProducts(allProducts);
        });
    } catch (e) {
        console.log(e);
    }
}

/** Menampilkan Produk ke User */
function displayProducts(products) {
    bestSellerProductContainer.innerHTML = "";

    products.forEach(product => {
        const productContainer = document.createElement("div");
        productContainer.className = "product-container";
        productContainer.innerHTML = `
            <img src="./assets/img/${product.image}" alt="${product.name}-image">
            <h3>${product.name}</h3>
            <span>Rp${product.price.toLocaleString("id-ID")}</span>
        `;
        productContainer.addEventListener("click", () => {
            window.location.href = `./src/pages/details/details.html?id=${product.id}`;
        });
        bestSellerProductContainer.appendChild(productContainer);
    });
}

function searchCode(kode) {
    codeValid.innerText = "";
    codeValid.style.color = "black";
    codeProduct.forEach(code => {
        if (kode === code) {
            codeValid.innerText = "Kode Produk Valid!";
            codeValid.style.color = "green";
            reviewInput.classList.add("show");
        } else {
            codeValid.innerText = "Kode Produk Tidak Valid!";
            codeValid.style.color = "tomato";
            reviewInput.classList.remove("show");
        }
    })

}

const reviewsRef = ref(db, 'reviews');
const reviewsDisplay = document.getElementById("reviewsDisplay");

onValue(reviewsRef, (snapshot) => {
    const data = snapshot.val();
    reviewsDisplay.innerHTML = ""; // Kosongkan dulu

    if (data) {
        // Ambil data dan tampilkan
        Object.keys(data).reverse().forEach((key) => { // reverse() agar review terbaru di atas
            const item = data[key];
            
            const card = document.createElement("div");
            card.className = "review-item-card";
            card.innerHTML = `
                <div class="review-header">
                    <span class="review-code">${item.produk_kode}</span>
                    <span class="review-stars">${"★".repeat(item.rating)}</span>
                </div>
                <p class="review-text">${item.komentar}</p>
                <small class="review-date">${item.tanggal}</small>
            `;
            reviewsDisplay.appendChild(card);
        });
    } else {
        reviewsDisplay.innerHTML = "<p>Belum ada ulasan untuk produk ini.</p>";
    }
});

// <====== EventListener ======>

const overlay = document.getElementById("overlay");

// Hamburger Navbar
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
})

const home = document.querySelector(".active");
home.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
})

// Review Window
const reviewButton = document.getElementById("reviewButton");
const reviewWindow = document.getElementById("reviewWindow");
reviewButton.addEventListener("click", () => {
    setTimeout(() => {
    overlay.classList.toggle("active");
    reviewWindow.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
    }, 50);
});

// Review Valid Code
const codeInput = document.getElementById("codeInput");
codeInput.addEventListener("input", (e) => {
    const input = e.target.value;
    searchCode(input);

})

// Tambahkan di dalam bagian EventListener di indexs.js
const stars = document.querySelectorAll('.star');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // Hapus class active dari semua bintang
        stars.forEach(s => s.classList.remove('active'));
        
        // Tambahkan class active ke bintang yang diklik dan bintang sebelumnya
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add('active');
        }
        
        // Simpan nilai rating (opsional)
        const ratingValue = star.getAttribute('value');
        console.log("Rating dipilih:", ratingValue);
    });
});

// indexs.js

const submitReviewBtn = document.querySelector("#reviewInput button[type='submit']");
const reviewTextInput = document.querySelector("#reviewInput input[type='text']");

submitReviewBtn.addEventListener("click", () => {
    const selectedStars = document.querySelectorAll(".star.active").length;
    const reviewText = reviewTextInput.value;
    const currentCode = codeInput.value;

    if (selectedStars > 0 && reviewText.trim() !== "") {
        // Kirim ke Firebase Realtime Database
        push(ref(db, 'reviews'), {
            produk_kode: currentCode,
            rating: selectedStars,
            komentar: reviewText,
            tanggal: new Date().toLocaleString()
        }).then(() => {
            alert("Terima kasih! Review Anda telah terkirim.");
            // Reset dan tutup modal
            location.reload(); 
        }).catch((error) => {
            console.error("Gagal mengirim:", error);
        });
    } else {
        alert("Mohon isi bintang dan ulasan Anda.");
    }
});

// Menutup modal dan mengaktifkan kembali interaksi saat overlay diklik
overlay.addEventListener("click", () => {
    reviewWindow.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    
    // Jika hamburger sedang terbuka, tutup juga
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
});



// <====== Initialize ======>

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
})
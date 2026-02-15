const addReviewBtn = document.getElementById('add-review');
const reviewOption = document.getElementById('reviewOptionContainer');
const overlay = document.getElementById('overlay');
const sendReviewBtn = document.getElementById('sendReview');

let product = [];

// Fungsi untuk membuka form review
addReviewBtn.addEventListener('click', () => {
    reviewOption.classList.add('active');
    overlay.classList.add('active');
});

// Fungsi untuk menutup jika klik di luar form (overlay)
overlay.addEventListener('click', () => {
    reviewOption.classList.remove('active');
    overlay.classList.remove('active');
});

// Fungsi saat kirim review
sendReviewBtn.addEventListener('click', () => {
    alert('Terima kasih! Review Anda telah dikirim.');
    reviewOption.classList.remove('active');
    overlay.classList.remove('active');
});

const stars = document.querySelectorAll('.star');

stars.forEach(star => {
    star.addEventListener('click', () => {
        const val = star.getAttribute('data-value');
        
        // Reset semua bintang dulu
        stars.forEach(s => s.classList.remove('active'));
        
        // Warnai bintang yang diklik dan sebelumnya
        for (let i = 0; i < val; i++) {
            stars[i].classList.add('active');
        }
        
        console.log("User memberi rating:", val);
    });
});

// details.js
const closeBtn = document.getElementById('close'); // Tambahkan ini

// Tambahkan fungsi penutup
closeBtn.addEventListener('click', () => {
    reviewOption.classList.remove('active');
    overlay.classList.remove('active');
});

const backButton = document.getElementById("back");
backButton.addEventListener("click", () => {
    window.history.back();
})

// <====== Initialize ======>
document.addEventListener("DOMContentLoaded",async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const myId = urlParams.get('id');

    const response = await fetch("/data/product.json");
    const productJSON = await response.json();
    product = productJSON;
    const productDetail = product.find(item => item.id == myId);

    const productName = document.getElementById("name");
    const productNameTitle = document.getElementById("nameTitle");
    const productPrice = document.getElementById("price");
    const productImg = document.getElementById("img");
    const productDescription = document.getElementById("description");
    productDescription.innerText = productDetail.description;
    productName.innerText = productDetail.name;
    productNameTitle.innerText = productDetail.name;
    productImg.src = `/assets/img/${productDetail.image}`;
    productPrice.innerText = `Rp${productDetail.price.toLocaleString("id-ID")}`;
})
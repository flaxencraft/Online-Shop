// Tunggu sampai seluruh konten HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    // 1. Ambil semua tombol beli
    const buttons = document.querySelectorAll('.buy-button');

    // 2. Tambahkan fungsi klik ke setiap tombol
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            
            // Mengambil container produk terdekat dari tombol yang diklik
            const productCard = button.parentElement;
            
            // Mengambil teks dari nama dan harga
            const namaProduk = productCard.querySelector('h3').innerText;
            const hargaProduk = productCard.querySelector('p').innerText;

            // Tampilkan pesan konfirmasi
            alert(`Berhasil! ${namaProduk} (${hargaProduk}) masuk ke keranjang.`);
            
            // Efek tambahan: Ubah teks tombol sementara
            button.innerText = "Ditambahkan!";
            button.style.backgroundColor = "#2ecc71";
            
            setTimeout(() => {
                button.innerText = "Beli Sekarang";
                button.style.backgroundColor = "#4CAF50";
            }, 2000);
        });
    });
});
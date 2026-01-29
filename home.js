const productList = [
    {
        "name": "Cireng",
        "price": 5000,
        "image": "./cireng.jpg"
    },
    {
        "name": "Cilok",
        "price": 500,
        "image": "./cilok.jpg"
    },
    {
        "name": "Ayam Geprek",
        "price": 10000,
        "image": "./ayam_geprek.jpg"
    }
];

// Initialize cart from localStorage
let totalPrice = localStorage.getItem("totalPrice") ? parseInt(localStorage.getItem("totalPrice")) : 0;
let totalProduct = localStorage.getItem("totalProduct") ? parseInt(localStorage.getItem("totalProduct")) : 0;
let cart = [];
const totalElement = document.getElementById("totalItemPrice");
totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice}(${totalPrice >= 10000 ? 'Gratis ongkir' : '-Rp' + (10000 - totalPrice) + ' Gratis ongkir'})`;
totalElement.style.color = totalPrice >= 10000 ? "green" : "black";

// Render product list
const productContainer = document.querySelector(".best-seller-product");
productList.forEach(product => {
    const productElement = document.createElement('a');
    productElement.className = 'product-container';
    productElement.href = '#';
    productElement.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Rp ${product.price}</p>
    `;
    productElement.addEventListener("click", () => {
        updateCartDisplay(product);
        renderCart();
    });
    productContainer.appendChild(productElement);
})

/** Update tampilan cart */
function updateCartDisplay(product) {
    console.log(`${product.name} buyed, total price: Rp ${product.price}`);
    totalPrice += product.price;
    totalProduct += 1;
    if (totalPrice >= 10000) {
        totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice} - Gratis ongkir!`;
        totalElement.style.color = "green";
    } else {
        totalElement.innerText = `Total (${totalProduct} items): Rp ${totalPrice}(-Rp${10000 - totalPrice} Gratis ongkir)`;
    }
    if (cart.find(item => item.product === product.name)) {
        const index = cart.findIndex(item => item.product === product.name);
        cart[index].quantity += 1;
        showCartItems();
    } else {
        const value = {product: product.name, price: product.price, quantity: 1};
        cart.push(value);
        showCartItems();
    }
    localStorage.setItem("totalPrice", totalPrice);
    localStorage.setItem("totalProduct", totalProduct);
}

/** Show cart list di console */
function showCartItems() {
    console.log("=== Cart Items ===");
    cart.forEach(item => {
        console.log(`${item.product} - Rp${item.price} x${item.quantity}`);
    })
}

// Menampilkan dan menyembunyikan cart list
let show = false;
const showButton = document.getElementById("showButton");
showButton.addEventListener("click", () => {
    const cartListElement = document.getElementById("cartListContainer");
    if (show === true) {
        showButton.innerText = "Tampilkan";
        cartListElement.hidden = true;
        show = false;
    } else {
        renderCart();
        showButton.innerText = "Sembunyikan";
        cartListElement.hidden = false;
        show = true;
    }
})

/** Render cart list */
function renderCart() {
    const cartListElement = document.getElementById("cartListContainer");
    let grandTotal = 0;
    const grandTotalElement = document.createElement("h3");
    cartListElement.innerHTML = "";
    cart.forEach(item => {
        const itemElement = document.createElement("p");
        itemElement.innerText = `${item.product} - x${item.quantity} - Rp${item.price * item.quantity}`;
        cartListElement.appendChild(itemElement);
        grandTotal += item.price * item.quantity;
    });
    grandTotalElement.innerText = `Grand Total: Rp${grandTotal}`;
    cartListElement.appendChild(grandTotalElement);
}
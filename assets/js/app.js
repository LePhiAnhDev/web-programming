// --- Utils ---
const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);

// --- State ---
let productsData = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- Init Application ---
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    setupMobileMenu();
    fetchData();

    // Setup Contact Form Validation nếu đang ở trang liên hệ
    if (document.getElementById("contact-form")) setupFormValidation();
});

// --- Mobile Menu Toggle ---
function setupMobileMenu() {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (btn && menu) {
        btn.addEventListener("click", () => menu.classList.toggle("hidden"));
    }
}

// --- Fetch Data ---
async function fetchData() {
    try {
        const response = await fetch("data.json");
        productsData = await response.json();
        routePage();
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

// --- Router ---
function routePage() {
    if (document.getElementById("latest-products"))
        renderProducts(productsData.slice(0, 8), "latest-products");
    if (document.getElementById("product-list")) {
        renderProducts(productsData, "product-list");
        setupFilters();
        setupViewToggle();
    }
    if (document.getElementById("product-detail")) renderDetail();
    if (document.getElementById("cart-items")) renderCart();
}

// --- Render Products (Index & Products) ---
function renderProducts(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data
        .map(
            (product) => `
        <article class="product-card bg-white rounded shadow-md overflow-hidden hover:shadow-lg transition">
            <a href="detail.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            </a>
            <div class="p-4 flex flex-col justify-between">
                <a href="detail.html?id=${product.id}"><h3 class="font-bold text-lg mb-2 truncate">${product.name}</h3></a>
                <p class="text-red-600 font-bold mb-4">${formatPrice(product.price)}</p>
                <button onclick="addToCart(${product.id})" class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">Thêm vào giỏ</button>
            </div>
        </article>
    `,
        )
        .join("");
}

// --- Filters & Search ---
function setupFilters() {
    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");

    const filterData = () => {
        let filtered = productsData;
        // Lọc Tên
        if (searchInput.value) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchInput.value.toLowerCase()),
            );
        }
        // Lọc Danh mục
        if (categoryFilter.value !== "All") {
            filtered = filtered.filter(
                (p) => p.category === categoryFilter.value,
            );
        }
        // Lọc Giá
        if (priceFilter.value !== "All") {
            const [min, max] = priceFilter.value.split("-").map(Number);
            filtered = filtered.filter((p) => p.price >= min && p.price <= max);
        }
        renderProducts(filtered, "product-list");
    };

    searchInput.addEventListener("input", filterData);
    categoryFilter.addEventListener("change", filterData);
    priceFilter.addEventListener("change", filterData);
}

// --- Toggle Grid/List ---
function setupViewToggle() {
    const container = document.getElementById("product-list");
    document.getElementById("grid-view-btn").addEventListener("click", () => {
        container.classList.remove("list-view");
        container.classList.add(
            "grid",
            "grid-cols-1",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
        );
    });
    document.getElementById("list-view-btn").addEventListener("click", () => {
        container.classList.add("list-view");
        container.classList.remove(
            "grid",
            "grid-cols-1",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
        );
    });
}

// --- Detail Page ---
function renderDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get("id"));
    const product = productsData.find((p) => p.id === id);
    const container = document.getElementById("product-detail");

    if (product) {
        container.innerHTML = `
            <div class="w-full md:w-1/2">
                <img src="${product.image}" alt="${product.name}" class="w-full rounded">
            </div>
            <div class="w-full md:w-1/2 flex flex-col justify-center">
                <h1 class="text-3xl font-bold mb-4">${product.name}</h1>
                <p class="text-2xl text-red-600 font-bold mb-4">${formatPrice(product.price)}</p>
                <p class="text-gray-600 mb-6">${product.description}</p>
                <div class="flex items-center gap-4 mb-6">
                    <label class="font-bold">Số lượng:</label>
                    <input type="number" id="detail-qty" value="1" min="1" class="border p-2 w-20 rounded text-center">
                </div>
                <button onclick="addDetailToCart(${product.id})" class="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 w-fit">Thêm Vào Giỏ Hàng</button>
            </div>
        `;
    } else {
        container.innerHTML = `<p class="text-red-500">Sản phẩm không tồn tại.</p>`;
    }
}

// --- Cart Logic ---
function updateCartCount() {
    const counts = document.querySelectorAll("#cart-count");
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    counts.forEach((c) => (c.textContent = total));
}

window.addToCart = (id) => {
    const product = productsData.find((p) => p.id === id);
    if (!product) return;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    saveCart();
    alert("Đã thêm sản phẩm vào giỏ!");
};

window.addDetailToCart = (id) => {
    const product = productsData.find((p) => p.id === id);
    const qty = parseInt(document.getElementById("detail-qty").value) || 1;
    if (!product) return;
    const existing = cart.find((item) => item.id === id);
    if (existing) existing.quantity += qty;
    else cart.push({ ...product, quantity: qty });
    saveCart();
    alert("Đã thêm sản phẩm vào giỏ!");
};

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    if (document.getElementById("cart-items")) renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<tr><td colspan="5" class="text-center p-4">Giỏ hàng trống.</td></tr>`;
        totalEl.textContent = "0 VNĐ";
        return;
    }

    let totalMoney = 0;
    container.innerHTML = cart
        .map((item, index) => {
            totalMoney += item.price * item.quantity;
            return `
        <tr class="border-b text-center">
            <td class="p-3 flex items-center gap-4 text-left">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded">
                <span class="font-semibold">${item.name}</span>
            </td>
            <td class="p-3 text-red-500 font-bold">${formatPrice(item.price)}</td>
            <td class="p-3">
                <input type="number" min="1" value="${item.quantity}" onchange="updateQty(${index}, this.value)" class="w-16 border text-center rounded">
            </td>
            <td class="p-3 text-red-500 font-bold">${formatPrice(item.price * item.quantity)}</td>
            <td class="p-3">
                <button onclick="removeCartItem(${index})" class="text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `;
        })
        .join("");
    totalEl.textContent = formatPrice(totalMoney);
}

window.updateQty = (index, val) => {
    let qty = parseInt(val);
    if (qty < 1) qty = 1;
    cart[index].quantity = qty;
    saveCart();
};

window.removeCartItem = (index) => {
    cart.splice(index, 1);
    saveCart();
};

// --- Form Validation ---
function setupFormValidation() {
    const form = document.getElementById("contact-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const msg = document.getElementById("message").value.trim();

        // Validate Name
        if (!name) {
            document.getElementById("name-err").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("name-err").classList.add("hidden");
        }

        // Validate Email (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById("email-err").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("email-err").classList.add("hidden");
        }

        // Validate Phone (Số và không trống)
        const phoneRegex = /^[0-9]{9,11}$/;
        if (!phoneRegex.test(phone)) {
            document.getElementById("phone-err").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("phone-err").classList.add("hidden");
        }

        // Validate Message
        if (!msg) {
            document.getElementById("message-err").classList.remove("hidden");
            isValid = false;
        } else {
            document.getElementById("message-err").classList.add("hidden");
        }

        if (isValid) {
            alert("Gửi liên hệ thành công!");
            form.reset();
        }
    });
}

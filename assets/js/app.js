// --- Utils ---
const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

// --- Toast Notification System ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    info: "fa-circle-info",
  };
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <span class="toast-msg">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-xmark"></i></button>
    `;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

// --- State ---
let productsData = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupMobileMenu();
  setupGlobalSearch();
  fetchData();
  if (document.getElementById("contact-form")) setupFormValidation();
});

// --- Mobile Menu ---
function setupMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      const icon = btn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });
  }
}

// --- Global Search (header) → redirect to products.html ---
function setupGlobalSearch() {
  const input = document.getElementById("global-search");
  if (!input) return;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()) {
      window.location.href = `products.html?q=${encodeURIComponent(input.value.trim())}`;
    }
  });
}

// --- Fetch Data ---
async function fetchData() {
  try {
    showSkeletons();
    const res = await fetch("data.json");
    productsData = await res.json();
    routePage();
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
    hideSkeletons();
  }
}

function showSkeletons() {
  const targets = ["latest-products", "product-list"];
  targets.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = Array(el.id === "latest-products" ? 8 : 6)
      .fill(0)
      .map(
        () => `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton-body">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-price"></div>
                    <div class="skeleton skeleton-btn"></div>
                </div>
            </div>
        `,
      )
      .join("");
  });
}

function hideSkeletons() {
  const targets = ["latest-products", "product-list"];
  targets.forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.innerHTML =
        '<p class="text-center text-gray-400 py-8 col-span-full">Không thể tải dữ liệu.</p>';
  });
}

// --- Router ---
function routePage() {
  if (document.getElementById("latest-products"))
    renderProducts(productsData.slice(0, 8), "latest-products");
  if (document.getElementById("product-list")) {
    // Check for global search query param
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      const searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = q;
    }
    renderProducts(productsData, "product-list");
    setupFilters(q || "");
    setupViewToggle();
  }
  if (document.getElementById("product-detail")) renderDetail();
  if (document.getElementById("cart-items")) renderCart();
}

// --- Render Products ---
function renderProducts(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (data.length === 0) {
    container.innerHTML = `
            <div class="empty-state col-span-full">
                <div class="empty-state-icon"><i class="fas fa-box-open"></i></div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm.</p>
            </div>`;
    return;
  }

  container.innerHTML = data
    .map(
      (p) => `
        <article class="product-card">
            <div class="card-img-wrap">
                <a href="detail.html?id=${p.id}">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                </a>
                <span class="card-badge">${p.category === "Laptop" ? "Laptop" : "Điện thoại"}</span>
            </div>
            <div class="card-body">
                <p class="card-category">
                    <i class="fas fa-tag"></i>${p.category}
                </p>
                <a href="detail.html?id=${p.id}">
                    <h3 title="${p.name}">${p.name}</h3>
                </a>
                <p class="card-price">${formatPrice(p.price)}</p>
                <button class="btn-add-cart" onclick="addToCart(${p.id})">
                    <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                </button>
            </div>
        </article>
    `,
    )
    .join("");
}

// --- Filters ---
function setupFilters(initialQuery = "") {
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");
  const priceFilter = document.getElementById("price-filter");
  if (!searchInput || !categoryFilter || !priceFilter) return;

  const filterData = () => {
    let filtered = productsData;
    const q = searchInput.value.toLowerCase();
    if (q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    if (categoryFilter.value !== "All")
      filtered = filtered.filter((p) => p.category === categoryFilter.value);
    if (priceFilter.value !== "All") {
      const [min, max] = priceFilter.value.split("-").map(Number);
      filtered = filtered.filter((p) => p.price >= min && p.price <= max);
    }
    renderProducts(filtered, "product-list");
    updateResultCount(filtered.length);
  };

  if (initialQuery) filterData();
  searchInput.addEventListener("input", filterData);
  categoryFilter.addEventListener("change", filterData);
  priceFilter.addEventListener("change", filterData);
}

function updateResultCount(count) {
  const el = document.getElementById("result-count");
  if (el) el.textContent = `${count} sản phẩm`;
}

// --- View Toggle ---
function setupViewToggle() {
  const container = document.getElementById("product-list");
  const gridBtn = document.getElementById("grid-view-btn");
  const listBtn = document.getElementById("list-view-btn");
  if (!container || !gridBtn || !listBtn) return;

  gridBtn.addEventListener("click", () => {
    container.classList.remove("list-view");
    container.className = container.className.replace(/list-view/g, "");
    if (!container.classList.contains("grid")) {
      container.classList.add(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "gap-6",
      );
    }
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
  });

  listBtn.addEventListener("click", () => {
    container.classList.add("list-view");
    container.classList.remove(
      "grid",
      "grid-cols-1",
      "sm:grid-cols-2",
      "lg:grid-cols-3",
    );
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
  });

  // Default active
  gridBtn.classList.add("active");
}

// --- Detail Page ---
function renderDetail() {
  const id = parseInt(new URLSearchParams(window.location.search).get("id"));
  const product = productsData.find((p) => p.id === id);
  const container = document.getElementById("product-detail");

  if (!product) {
    container.innerHTML = `
            <div class="empty-state w-full">
                <div class="empty-state-icon"><i class="fas fa-circle-exclamation"></i></div>
                <h3>Sản phẩm không tồn tại</h3>
                <p>Sản phẩm đã bị xoá hoặc liên kết không hợp lệ.</p>
                <a href="products.html" class="btn-primary" style="text-decoration:none;display:inline-flex;">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </a>
            </div>`;
    return;
  }

  container.innerHTML = `
        <div class="detail-container w-full">
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
                <a href="index.html">Trang chủ</a>
                <i class="fas fa-chevron-right"></i>
                <a href="products.html">Sản phẩm</a>
                <i class="fas fa-chevron-right"></i>
                <span style="color:var(--text-primary)">${product.name}</span>
            </nav>

            <div class="flex flex-col md:flex-row gap-10">
                <!-- Image -->
                <div class="w-full md:w-1/2">
                    <div style="border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);background:#f1f5f9;">
                        <img src="${product.image}" alt="${product.name}"
                            class="w-full object-cover detail-img"
                            style="height:360px;object-fit:cover;"
                        >
                    </div>
                </div>

                <!-- Info -->
                <div class="w-full md:w-1/2 flex flex-col justify-center gap-4">
                    <span class="detail-category-tag">
                        <i class="fas fa-tag" style="font-size:0.7rem;"></i>
                        ${product.category}
                    </span>
                    <h1 class="detail-title" style="font-family:'Be Vietnam Pro',sans-serif;font-size:1.8rem;font-weight:800;letter-spacing:-0.03em;line-height:1.2;">${product.name}</h1>
                    <p class="detail-price">${formatPrice(product.price)}</p>
                    <p style="color:var(--text-secondary);line-height:1.7;font-size:0.95rem;">${product.description}</p>

                    <!-- Divider -->
                    <div style="height:1px;background:var(--border);"></div>

                    <!-- Quantity -->
                    <div class="flex items-center gap-4">
                        <label style="font-weight:600;font-size:0.9rem;color:var(--text-secondary);">Số lượng:</label>
                        <div class="flex items-center gap-2">
                            <button onclick="changeQty(-1)" style="width:34px;height:34px;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-page);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all var(--transition);" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">−</button>
                            <input type="number" id="detail-qty" value="1" min="1" class="detail-qty-input">
                            <button onclick="changeQty(1)" style="width:34px;height:34px;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-page);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:all var(--transition);" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">+</button>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-3 flex-wrap">
                        <button onclick="addDetailToCart(${product.id})" class="btn-primary">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
                        </button>
                        <a href="products.html" style="display:inline-flex;align-items:center;gap:6px;padding:13px 20px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-family:'Be Vietnam Pro',sans-serif;font-weight:600;font-size:0.9rem;color:var(--text-secondary);text-decoration:none;transition:all var(--transition);" onmouseover="this.style.borderColor='var(--primary-dark)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-secondary)'">
                            <i class="fas fa-arrow-left" style="font-size:0.8rem;"></i> Tiếp tục mua
                        </a>
                    </div>
                </div>
            </div>
        </div>`;
}

window.changeQty = (delta) => {
  const input = document.getElementById("detail-qty");
  if (!input) return;
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  input.value = val;
};

// --- Cart Logic ---
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach((el) => {
    el.textContent = total;
    el.style.display = total > 0 ? "" : "none";
  });
}

window.addToCart = (id) => {
  const product = productsData.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });
  saveCart();
  showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, "success");
};

window.addDetailToCart = (id) => {
  const product = productsData.find((p) => p.id === id);
  const qty = parseInt(document.getElementById("detail-qty")?.value) || 1;
  if (!product) return;
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity += qty;
  else cart.push({ ...product, quantity: qty });
  saveCart();
  showToast(`Đã thêm ${qty} "${product.name}" vào giỏ hàng!`, "success");
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
    container.innerHTML = `
            <tr><td colspan="5">
                <div class="cart-empty-state">
                    <i class="fas fa-cart-shopping"></i>
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <a href="products.html"><i class="fas fa-arrow-left"></i> Tiếp tục mua sắm</a>
                </div>
            </td></tr>`;
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }

  let total = 0;
  container.innerHTML = cart
    .map((item, i) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <tr>
            <td class="p-3">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg" style="border:1px solid var(--border);">
                    <div>
                        <p class="font-semibold text-sm leading-snug">${item.name}</p>
                        <p style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${item.category}</p>
                    </div>
                </div>
            </td>
            <td class="p-3 text-center" style="color:var(--text-secondary);font-size:0.9rem;">${formatPrice(item.price)}</td>
            <td class="p-3 text-center">
                <input type="number" min="1" value="${item.quantity}"
                    onchange="updateQty(${i}, this.value)"
                    class="cart-qty-input">
            </td>
            <td class="p-3 text-center font-bold" style="color:var(--danger);font-family:'Be Vietnam Pro',sans-serif;">${formatPrice(subtotal)}</td>
            <td class="p-3 text-center">
                <button onclick="removeCartItem(${i})" class="btn-remove" title="Xoá">
                    <i class="fas fa-trash-can"></i>
                </button>
            </td>
        </tr>`;
    })
    .join("");

  if (totalEl) totalEl.textContent = formatPrice(total);
}

window.updateQty = (index, val) => {
  let qty = parseInt(val);
  if (isNaN(qty) || qty < 1) qty = 1;
  cart[index].quantity = qty;
  saveCart();
};

window.removeCartItem = (index) => {
  const name = cart[index]?.name;
  cart.splice(index, 1);
  saveCart();
  if (name) showToast(`Đã xoá "${name}" khỏi giỏ hàng.`, "info");
};

// Checkout button handler (global — injected from cart.html)
window.handleCheckout = () => {
  if (cart.length === 0) {
    showToast("Giỏ hàng đang trống!", "error");
    return;
  }
  showToast("Chức năng thanh toán đang được phát triển!", "info");
};

// --- Contact Form Validation ---
function validateField(id) {
  const input = document.getElementById(id);
  const err = document.getElementById(`${id}-err`);
  if (!input || !err) return true;
  const val = input.value.trim();
  let msg = "";

  switch (id) {
    case "name":
      if (!val) msg = "Vui lòng nhập họ và tên.";
      else if (val.length < 2) msg = "Họ và tên phải có ít nhất 2 ký tự.";
      break;
    case "email":
      if (!val) msg = "Vui lòng nhập email.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val))
        msg = "Email không đúng định dạng (vd: ten@email.com).";
      break;
    case "phone": {
      const digits = val.replace(/[\s\-().]/g, "");
      if (!val) msg = "Vui lòng nhập số điện thoại.";
      else if (/[^0-9\s\-().+]/.test(val))
        msg = "Số điện thoại chỉ được chứa chữ số.";
      else if (!/^(0|\+84)/.test(digits))
        msg = "Số điện thoại phải bắt đầu bằng 0 hoặc +84.";
      else if (
        digits.replace(/^\+84/, "0").length < 10 ||
        digits.replace(/^\+84/, "0").length > 11
      )
        msg = "Số điện thoại phải có 10–11 chữ số.";
      break;
    }
    case "message":
      if (!val) msg = "Vui lòng nhập nội dung tin nhắn.";
      else if (val.length < 10)
        msg = `Nội dung quá ngắn (tối thiểu 10 ký tự, hiện có ${val.length}).`;
      break;
  }

  if (msg) {
    err.innerHTML = `<i class="fas fa-circle-exclamation" style="font-size:0.75rem"></i> ${msg}`;
    err.classList.remove("hidden");
    input.classList.add("error");
    return false;
  }
  err.classList.add("hidden");
  input.classList.remove("error");
  return true;
}

function setupFormValidation() {
  const form = document.getElementById("contact-form");
  const fieldIds = ["name", "email", "phone", "message"];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstInvalid = null;
    let allValid = true;

    fieldIds.forEach((id) => {
      const valid = validateField(id);
      if (!valid && !firstInvalid) firstInvalid = id;
      if (!valid) allValid = false;
    });

    if (allValid) {
      showToast(
        "Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.",
        "success",
      );
      form.reset();
    } else {
      document.getElementById(firstInvalid)?.focus();
      showToast("Vui lòng kiểm tra lại thông tin.", "error");
    }
  });

  // Real-time: clear error on input, re-validate on blur
  fieldIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      input.classList.remove("error");
      document.getElementById(`${id}-err`)?.classList.add("hidden");
    });
    input.addEventListener("blur", () => {
      if (input.value.trim()) validateField(id);
    });
  });
}

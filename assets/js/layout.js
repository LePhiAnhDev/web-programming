function getCurrentPageName() {
  const path = window.location.pathname.split("/").pop();
  return path || "index.html";
}

function navClass(target) {
  return getCurrentPageName() === target ? "active-link" : "";
}

function createHeaderMarkup() {
  return `
    <header class="bg-white shadow-sm sticky top-0 z-50" style="background:rgba(255,255,255,0.95);backdrop-filter:blur(16px);">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center gap-4">

            <!-- Logo -->
            <a href="index.html" class="flex items-center gap-2.5 flex-shrink-0">
                <img src="assets/images/logo.png" alt="GDU TechStore" class="h-9 w-9 object-contain">
                <span class="logo-text text-xl hidden sm:block">GDU TechStore</span>
            </a>

            <!-- Desktop Nav -->
            <nav class="hidden md:flex items-center gap-6">
                <a href="index.html" class="${navClass("index.html")}">Trang chủ</a>
                <a href="products.html" class="${navClass("products.html")}">Sản phẩm</a>
                <a href="contact.html" class="${navClass("contact.html")}">Liên hệ</a>
            </nav>

            <!-- Right Controls -->
            <div class="flex items-center gap-3">
                <!-- Search -->
                <div class="relative hidden lg:block">
                    <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                    <input type="text" id="global-search" placeholder="Tìm kiếm..." autocomplete="off">
                </div>

                <!-- Cart -->
                <a href="cart.html" class="relative text-gray-600 hover:text-blue-600 transition-colors p-1" aria-label="Giỏ hàng">
                    <i class="fas fa-shopping-cart text-xl"></i>
                    <span id="cart-count" class="cart-badge absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full">0</span>
                </a>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-btn" class="md:hidden text-gray-600 text-xl p-1" aria-label="Menu">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <nav id="mobile-menu" class="hidden md:hidden border-t bg-white px-4 py-3 space-y-1">
            <a href="index.html" class="block py-2 px-3 rounded-lg font-medium text-sm ${navClass("index.html") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}">
                <i class="fas fa-home mr-2 text-xs"></i>Trang chủ
            </a>
            <a href="products.html" class="block py-2 px-3 rounded-lg font-medium text-sm ${navClass("products.html") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}">
                <i class="fas fa-box mr-2 text-xs"></i>Sản phẩm
            </a>
            <a href="contact.html" class="block py-2 px-3 rounded-lg font-medium text-sm ${navClass("contact.html") ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}">
                <i class="fas fa-envelope mr-2 text-xs"></i>Liên hệ
            </a>
        </nav>
    </header>`;
}

function createFooterMarkup() {
  return `
    <footer class="py-12 mt-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">

                <!-- Brand -->
                <div>
                    <div class="flex items-center gap-3 mb-3">
                        <img src="assets/images/logo.png" alt="GDU TechStore" class="h-10 w-10 object-contain">
                        <span class="footer-brand">GDU TechStore</span>
                    </div>
                    <p class="footer-desc">Cung cấp thiết bị công nghệ hàng đầu, chính hãng, bảo hành uy tín toàn quốc.</p>
                    <div class="flex gap-2 mt-4">
                        <a href="#" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                        <a href="#" class="social-link" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
                        <a href="#" class="social-link" aria-label="Zalo"><i class="fas fa-comment-dots"></i></a>
                    </div>
                </div>

                <!-- Contact -->
                <div>
                    <h3 class="footer-heading">Thông tin liên hệ</h3>
                    <div class="footer-contact-item">
                        <span class="footer-contact-item"><i class="fas fa-map-marker-alt"></i></span>
                        <span>123 Nguyễn Văn Bảo, P.4, Gò Vấp, TP.HCM</span>
                    </div>
                    <div class="footer-contact-item">
                        <span><i class="fas fa-phone"></i></span>
                        <span>0123.456.789</span>
                    </div>
                    <div class="footer-contact-item">
                        <span><i class="fas fa-envelope"></i></span>
                        <span>support@gdutechstore.vn</span>
                    </div>
                    <div class="footer-contact-item">
                        <span><i class="fas fa-clock"></i></span>
                        <span>Thứ 2 – Chủ nhật: 8:00 – 21:00</span>
                    </div>
                </div>

                <!-- Map -->
                <div>
                    <h3 class="footer-heading">Bản đồ cửa hàng</h3>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.060360274028!2d106.62627401533428!3d10.806689061589718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be27d8b4f4d%3A0x92dcba2950430867!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBHaWEgxJDhu4tuaA!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s"
                        width="100%" height="160" style="border:0" allowfullscreen loading="lazy">
                    </iframe>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 GDU TechStore</p>
            </div>
        </div>
    </footer>`;
}

function renderSharedLayout() {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = createHeaderMarkup();
  if (footerEl) footerEl.innerHTML = createFooterMarkup();
}

// Inject toast container once
function ensureToastContainer() {
  if (!document.getElementById("toast-container")) {
    const el = document.createElement("div");
    el.id = "toast-container";
    document.body.appendChild(el);
  }
}

renderSharedLayout();
ensureToastContainer();

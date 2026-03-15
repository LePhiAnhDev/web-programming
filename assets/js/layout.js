function getCurrentPageName() {
    const path = window.location.pathname.split("/").pop();
    return path || "index.html";
}

function getNavLinkClass(targetPage) {
    const baseClass = "hover:text-blue-600";
    return getCurrentPageName() === targetPage
        ? "text-blue-600 font-bold"
        : baseClass;
}

function createHeaderMarkup() {
    return `
        <header class="bg-white shadow-md sticky top-0 z-50">
            <div class="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="index.html" class="flex items-center gap-3 text-2xl font-bold text-blue-600">
                    <img
                        src="assets/images/logo.png"
                        alt="GDU TechStore Logo"
                        class="h-10 w-10 object-contain"
                    />
                    <span>GDU TechStore</span>
                </a>
                <nav class="hidden md:flex space-x-6">
                    <a href="index.html" class="${getNavLinkClass("index.html")}">Trang chủ</a>
                    <a href="products.html" class="${getNavLinkClass("products.html")}">Sản phẩm</a>
                    <a href="contact.html" class="${getNavLinkClass("contact.html")}">Liên hệ</a>
                </nav>
                <div class="flex items-center space-x-4">
                    <input
                        type="text"
                        id="global-search"
                        placeholder="Tìm kiếm..."
                        class="hidden lg:block border rounded px-3 py-1 outline-none focus:border-blue-500"
                    />
                    <a href="cart.html" class="relative text-gray-600 hover:text-blue-600">
                        <i class="fas fa-shopping-cart text-xl"></i>
                        <span
                            id="cart-count"
                            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
                        >0</span>
                    </a>
                    <button id="mobile-menu-btn" class="md:hidden text-gray-600 text-2xl">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            <nav id="mobile-menu" class="hidden bg-white border-t p-4 flex-col space-y-2 md:hidden">
                <a href="index.html" class="block ${getNavLinkClass("index.html")}">Trang chủ</a>
                <a href="products.html" class="block ${getNavLinkClass("products.html")}">Sản phẩm</a>
                <a href="contact.html" class="block ${getNavLinkClass("contact.html")}">Liên hệ</a>
            </nav>
        </header>
    `;
}

function createFooterMarkup() {
    return `
        <footer class="bg-gray-800 text-white py-10 mt-10">
            <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center gap-3 mb-4">
                        <img
                            src="assets/images/logo.png"
                            alt="GDU TechStore Logo"
                            class="h-12 w-12 object-contain"
                        />
                        <h3 class="text-xl font-bold">GDU TechStore</h3>
                    </div>
                    <p>Cung cấp các thiết bị công nghệ hàng đầu.</p>
                    <div class="flex space-x-4 mt-4">
                        <a href="#" class="text-white hover:text-blue-400"><i class="fab fa-facebook"></i></a>
                        <a href="#" class="text-white hover:text-blue-400"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Liên hệ</h3>
                    <p><i class="fas fa-map-marker-alt"></i> TP.HCM, Việt Nam</p>
                    <p><i class="fas fa-phone"></i> 0123.456.789</p>
                </div>
                <div>
                    <h3 class="text-xl font-bold mb-4">Bản đồ</h3>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.060360274028!2d106.62627401533428!3d10.806689061589718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be27d8b4f4d%3A0x92dcba2950430867!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBHaWEgxJDhu4tuaA!5e0!3m2!1svi!2s!4v1680000000000!5m2!1svi!2s"
                        width="100%"
                        height="150"
                        style="border: 0"
                        allowfullscreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </footer>
    `;
}

function renderSharedLayout() {
    const headerContainer = document.getElementById("site-header");
    const footerContainer = document.getElementById("site-footer");

    if (headerContainer) {
        headerContainer.innerHTML = createHeaderMarkup();
    }

    if (footerContainer) {
        footerContainer.innerHTML = createFooterMarkup();
    }
}

renderSharedLayout();

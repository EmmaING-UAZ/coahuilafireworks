document.addEventListener('DOMContentLoaded', () => {
    // Menú Móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Cambiar aria-expanded para accesibilidad
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true' || false;
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
        });
    }

    // Botón Scroll to Top
    const scrollTopButton = document.getElementById('scrollTopButton');

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Mostrar el botón después de 300px de scroll
                scrollTopButton.classList.remove('hidden');
                scrollTopButton.classList.add('flex'); // O 'block' según el display que uses
            } else {
                scrollTopButton.classList.add('hidden');
                scrollTopButton.classList.remove('flex');
            }
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Lógica para abrir y cerrar el panel del carrito (común a todas las páginas)
    const cartButtonDesktop = document.getElementById('cart-button-desktop');
    const cartButtonMobile = document.getElementById('cart-button-mobile');
    const cartPanel = document.getElementById('cart-panel');
    const closeCartButton = document.getElementById('close-cart-button');
    const cartOverlay = document.getElementById('cart-overlay');

    const openCartPanel = () => {
        if (cartPanel && cartOverlay) {
            cartPanel.classList.remove('translate-x-full');
            cartOverlay.classList.remove('hidden');
            document.body.classList.add('cart-panel-open'); // Para evitar scroll del body
        }
    };

    const closeCartPanel = () => {
        if (cartPanel && cartOverlay) {
            cartPanel.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
            document.body.classList.remove('cart-panel-open');
        }
    };

    if (cartButtonDesktop) {
        cartButtonDesktop.addEventListener('click', openCartPanel);
    }
    if (cartButtonMobile) {
        cartButtonMobile.addEventListener('click', openCartPanel);
    }
    if (closeCartButton) {
        closeCartButton.addEventListener('click', closeCartPanel);
    }
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartPanel); // Cerrar al hacer clic en el overlay
    }

    // Cerrar carrito con tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !cartPanel.classList.contains('translate-x-full')) {
            closeCartPanel();
        }
    });


    // Scroll Reveal (simple implementación con Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-slide-in-left, .reveal-slide-in-right');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // No observar más una vez que es visible
                }
            });
        }, { threshold: 0.1 }); // Ajustar threshold según necesidad

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- CARRUSEL PRODUCTOS DESTACADOS (INDEX.HTML) ---
    // Esta sección ya no es necesaria si 'index.html' es el catálogo,
    // pero la dejo por si la usas en otra parte. Si no, puedes borrarla.
    const carouselTrack = document.getElementById('carousel-track');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const carouselContainer = document.getElementById('carousel-container');

    const featuredProducts = [
        { id: 'prod035', name: 'Cohetón de Luz', price: 450, image: 'img/productos/coheton-de-luz.webp', description: 'Contiene 12 piezas. El cohetón de luz es un proyectil...', classification: 'C', category: 'aereo', imageFit: 'contain' },
        { id: 'prod032', name: 'Cohetoncito de Micrófono', price: 220, image: 'img/productos/cohetoncito-de-microfono.webp', description: 'Contiene 12 piezas. La vara bomba, pero con el efecto más redondo...', classification: 'B', category: 'aereo', imageFit: 'contain' },
        { id: 'prod031', name: 'Cohetoncito de Cracker', price: 210, image: 'img/productos/cohetoncito-de-cracker.webp', description: 'Contiene 12 piezas. Vara que se eleva a 30 metros...', classification: 'B', category: 'aereo' },
        { id: 'prod007', name: 'Bazuka 3 Pulgadas', price: 255, image: 'img/productos/bazuka-3-pulgadas.webp', description: 'Proyectil de 3” impulsado al cielo...', classification: 'B', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod009', name: 'Bazuka 4 Pulgadas', price: 550, image: 'img/productos/bazuka-4-pulgadas.webp', description: 'Proyectil de 4” impulsada al cielo...', classification: 'C', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod008', name: 'Bazuka 3 Pulgadas Cacahuate', price: 320, image: 'img/productos/bazuka-3-pulgadas-cacahuate.webp', description: 'Proyectiles de 1”, 2” y 3” que abren en el cielo...', classification: 'B', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod042', name: 'Escupidor de Colores', price: 120, image: 'img/productos/escupidor-de-colores.webp', description: 'Contiene 12 piezas. El clásico escupidor...', classification: 'A', category: 'luz', imageFit: 'contain' },
    ];

    let isTransitioning = false;
    let currentCarouselIndex = 0;

    function getItemsPerPage() {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    function createProductCard(product) {
        const imageClass = product.imageFit === 'contain' ? 'long-product-image' : 'object-cover';
        return `
            <div class="carousel-item w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 p-2">
                <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full hover-effect">
                    <div class="relative">
                        <img src="${product.image || 'https://via.placeholder.com/300x200.png?text=Producto'}" alt="${product.name}" class="w-full h-48 ${imageClass}">
                        <div class="absolute top-2 right-2 bg-[var(--color-accent)] text-white text-xs font-bold px-2 py-1 rounded-full">${product.classification}</div>
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2 truncate" title="${product.name}">${product.name}</h3>
                        <p class="text-sm text-gray-600 mb-3 flex-grow">${product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}</p>
                        <p class="text-xl font-bold text-[var(--color-accent)] mb-4">${formatCurrency(product.price)}</p>
                        <div class="mt-auto">
                            <div class="flex items-center justify-center space-x-3 mb-4">
                                <button onclick="updateQuantity('${product.id}', -1)" aria-label="Disminuir cantidad" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">-</button>
                                <span id="quantity-${product.id}" class="text-lg font-semibold">1</span>
                                <button onclick="updateQuantity('${product.id}', 1)" aria-label="Aumentar cantidad" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">+</button>
                            </div>
                            <button onclick="window.addToCart({id:'${product.id}', name:'${product.name.replace(/'/g, "\\'")}', price:${product.price}, image:'${product.image}', description:'${product.description.replace(/'/g, "\\'")}'}, getQuantity('${product.id}'))"
                                    class="w-full bg-[var(--color-accent)] text-white py-2 px-4 rounded-md font-semibold hover:bg-[var(--color-primary-dark)] transition-colors duration-300 text-sm">
                                Agregar al Carrito
                            </button>
                            <button onclick="window.openPopularProductModal({id:'${product.id}', name:'${product.name.replace(/'/g, "\\'")}', price:${product.price}, image:'${product.image}', description:'${product.description.replace(/'/g, "\\'")}', classification:'${product.classification}'})"
                                    class="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300 text-sm">
                                Ver Más
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // (Resto de funciones del carrusel: setupCarousel, moveTo... si las necesitas)
    // ...

    // --- LÓGICA PARA PÁGINA DE CATÁLOGO (index.html) ---
    const catalogContainer = document.getElementById('catalog-product-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');

    // CAMBIO: Lista de productos reducida a 10
    const allProducts = [
        { id: 'prod001', name: 'Abejorro', price: 200, image: 'img/productos/abejorro.webp', description: 'Contiene 12 piezas. El Abejorro es conocido por sus movimientos rápidos y erráticos en el aire. Al encenderse, emite un sonido zumbante y una serie de destellos brillantes multicolor que imitan el vuelo de un abejorro. Ideal y seguro para la diversión y sorpresa de los pequeños.', classification: 'A', category: 'luz' },
        { id: 'prod002', name: 'Adrenocromo', price: 120, image: 'img/productos/adrenocromo.webp', description: 'Contiene 6 piezas. ¡Prepárate para una descarga de adrenalina! El Adrenocromo te ofrece una experiencia pirotécnica intensa y emocionante, al ser encendido ofrece una explosión intensa y vibrante de luz. Perfecto para eventos nocturnos y fiestas que buscan una sensación de adrenalina y emoción.', classification: 'B', category: 'luz' },
        { id: 'prod003', name: 'Batería Baby', price: 100, image: 'img/productos/bateria-baby.webp', description: 'La Batería Baby es una opción más compacta que combina seguridad y diversión. Sus disparos suaves y coloridos proporcionan un espectáculo visual encantador sin ser demasiado ruidosos. Los efectos incluyen estrellas de colores y destellos que mantendrán a los niños y adultos fascinados.', classification: 'B', category: 'aéreo' },
        { id: 'prod004', name: 'Batería La Reina', price: 150, image: 'img/productos/bateria-la-reina.webp', description: 'La Batería La Reina es un tributo a la majestuosidad. Sus disparos ofrecen una exhibición de luces y estallidos que iluminan el cielo. Perfecta para eventos y celebraciones que requieren un toque especial.', classification: 'B', category: 'aéreo' },
        { id: 'prod005', name: 'Bazuca Baby', price: 100, image: 'img/productos/bazuca-baby.webp', description: 'Serpiente de gran altura, con colores variados y tronidos.', classification: 'A', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod006', name: 'Bazuka 2 Pulgadas', price: 150, image: 'img/productos/bazuka-2-pulgadas.webp', description: 'Proyectil pequeño de 2”, que abre una esfera en el cielo de 50 metros de diámetro, aproximadamente.', classification: 'B', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod007', name: 'Bazuka 3 Pulgadas', price: 255, image: 'img/productos/bazuka-3-pulgadas.webp', description: 'Proyectil de 3” impulsado al cielo, con colores variados y un diámetro de apertura de 70 metros, aproximadamente.', classification: 'B', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod008', name: 'Bazuka 3 Pulgadas Cacahuate', price: 320, image: 'img/productos/bazuka-3-pulgadas-cacahuate.webp', description: 'Proyectiles de 1”, 2” y 3” que abren en el cielo secuencialmente, dando un espectáculo visualmente atractivo.', classification: 'B', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod009', name: 'Bazuka 4 Pulgadas', price: 550, image: 'img/productos/bazuka-4-pulgadas.webp', description: 'Proyectil de 4” impulsada al cielo, con una apertura de colores variados con un diámetro de, aproximadamente, 100 metros.', classification: 'C', category: 'aéreo', imageFit: 'contain' },
        { id: 'prod010', name: 'Billete', price: 80, image: 'img/productos/billete.webp', description: 'Varios disparos de serpientes de colores.', classification: 'B', category: 'aéreo' }
    ];

    const categories = [
        'Mostrar Todos',
        'aéreo',
        'luz',
        'trueno',
        'profesional'
    ];

    function renderProductCard(product) {
        const truncatedDescription = product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description;
        const imageClass = product.imageFit === 'contain' ? 'long-product-image' : 'object-cover';

        // Escapar comillas simples para que no rompan el string de JS en onclick
        const safeName = product.name.replace(/'/g, "\\'");
        const safeDesc = product.description.replace(/'/g, "\\'");

        return `
            <div class="product-card bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover-effect reveal-fade-in" data-category="${product.category}">
                <div class="relative">
                    <img src="${product.image || 'https://via.placeholder.com/300x200.png?text=Producto'}" alt="${product.name}" class="w-full h-56 ${imageClass}">
                    <div class="absolute top-2 right-2 bg-[var(--color-accent)] text-white text-xs font-bold px-2 py-1 rounded-full">${product.classification}</div>
                </div>
                <div class="p-5 flex flex-col flex-grow">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2 truncate" title="${product.name}">${product.name}</h3>
                    <p class="text-sm text-gray-500 mb-3 flex-grow">${truncatedDescription}</p>
                    <p class="text-2xl font-bold text-[var(--color-accent)] mb-5">${formatCurrency(product.price)}</p>
                    <div class="mt-auto space-y-2">
                        <div class="flex items-center justify-center space-x-3 mb-2">
                            <button onclick="updateQuantity('${product.id}', -1)" aria-label="Disminuir cantidad" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">-</button>
                            <span id="quantity-${product.id}" class="text-lg font-semibold">1</span>
                            <button onclick="updateQuantity('${product.id}', 1)" aria-label="Aumentar cantidad" class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300">+</button>
                        </div>
                        <button onclick="window.addToCart({id:'${product.id}', name:'${safeName}', price:${product.price}, image:'${product.image}', description:'${safeDesc}'}, getQuantity('${product.id}'))"
                                class="w-full bg-[var(--color-accent)] text-white py-2.5 px-4 rounded-md font-semibold hover:bg-[var(--color-primary-dark)] transition-colors duration-300 text-base">
                            Agregar al Carrito
                        </button>
                        <button onclick="window.openPopularProductModal({id:'${product.id}', name:'${safeName}', price:${product.price}, image:'${product.image}', description:'${safeDesc}', classification:'${product.classification}'})"
                                class="w-full bg-gray-200 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300 text-base">
                            Ver Más
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function displayProducts(productsToDisplay) {
        if (!catalogContainer) return;
        catalogContainer.innerHTML = '';
        productsToDisplay.forEach(product => {
            catalogContainer.innerHTML += renderProductCard(product);
        });
        // Re-initialize ScrollReveal
        const newRevealElements = catalogContainer.querySelectorAll('.reveal-fade-in');
        if (newRevealElements.length > 0 && typeof IntersectionObserver === 'function') {
             const tempObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            newRevealElements.forEach(el => tempObserver.observe(el));
        }
    }

    function renderCategoryFilters() {
        if (!categoryFiltersContainer) return;
        categoryFiltersContainer.innerHTML = '';
        categories.forEach(category => {
            const filterButton = document.createElement('button');
            filterButton.textContent = category;
            filterButton.classList.add('px-4', 'py-2', 'm-1', 'rounded-md', 'transition-colors', 'duration-300', 'font-medium', 'hover-effect');
            if (category === 'Mostrar Todos') {
                filterButton.classList.add('bg-[var(--color-accent)]', 'text-white');
                filterButton.dataset.active = "true";
            } else {
                filterButton.classList.add('bg-gray-200', 'text-gray-700');
            }
            filterButton.addEventListener('click', () => {
                handleFilterClick(category, filterButton);
            });
            categoryFiltersContainer.appendChild(filterButton);
        });
    }

    function handleFilterClick(category, clickedButton) {
        // Update active state for buttons
        const buttons = categoryFiltersContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.classList.remove('bg-[var(--color-accent)]', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
            button.dataset.active = "false";
        });
        clickedButton.classList.remove('bg-gray-200', 'text-gray-700');
        clickedButton.classList.add('bg-[var(--color-accent)]', 'text-white');
        clickedButton.dataset.active = "true";

        if (category === 'Mostrar Todos') {
            displayProducts(allProducts);
        } else {
            const filteredProducts = allProducts.filter(product => product.category === category);
            displayProducts(filteredProducts);
        }
    }


    if (catalogContainer && categoryFiltersContainer) {
        // Initial render on catalog page
        renderCategoryFilters();
        displayProducts(allProducts);

        const searchInput = document.getElementById('search-input-catalog');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase().trim();
                const activeCategoryButton = categoryFiltersContainer.querySelector('button[data-active="true"]');
                const activeCategory = activeCategoryButton ? activeCategoryButton.textContent : 'Mostrar Todos';

                let productsToFilter = allProducts;
                if (activeCategory !== 'Mostrar Todos') {
                    productsToFilter = allProducts.filter(p => p.category === activeCategory);
                }

                const filteredProducts = productsToFilter.filter(product => {
                    return product.name.toLowerCase().includes(searchTerm) ||
                           product.description.toLowerCase().includes(searchTerm);
                });
                displayProducts(filteredProducts);
            });

            const urlParams = new URLSearchParams(window.location.search);
            const searchFromUrl = urlParams.get('search');
            if (searchFromUrl) {
                searchInput.value = decodeURIComponent(searchFromUrl);
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    }
    // --- FIN LÓGICA PÁGINA DE CATÁLOGO ---

    const searchInputHome = document.getElementById('search-input-home');
    if (searchInputHome) {
        searchInputHome.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    // Esta lógica era para ir a catalogo.html, ahora que es index.html,
                    // solo disparamos el evento 'input' en el buscador del catálogo.
                    const searchInputCatalog = document.getElementById('search-input-catalog');
                    if (searchInputCatalog) {
                        searchInputCatalog.value = searchTerm;
                        searchInputCatalog.dispatchEvent(new Event('input'));
                    }
                    // O si prefieres recargar la página con el parámetro:
                    // window.location.href = `index.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }
});

// Funciones para los botones de +/- en las tarjetas de producto
function updateQuantity(productId, change) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    if (quantityElement) {
        let currentQuantity = parseInt(quantityElement.textContent, 10);
        currentQuantity += change;
        if (currentQuantity < 1) {
            currentQuantity = 1;
        }
        quantityElement.textContent = currentQuantity;
    }
}

function getQuantity(productId) {
    const quantityElement = document.getElementById(`quantity-${productId}`);
    if (quantityElement) {
        return parseInt(quantityElement.textContent, 10);
    }
    return 1; // Default to 1 if not found
}

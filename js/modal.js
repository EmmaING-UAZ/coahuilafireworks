document.addEventListener('DOMContentLoaded', () => {
    const productModal = document.getElementById('product-modal-popular');
    const closeModalButton = document.getElementById('close-modal-button-popular');

    // Elementos del modal que se actualizarán
    const modalProductName = document.getElementById('modal-product-name-popular');
    const modalProductClassification = document.getElementById('modal-product-classification-popular');
    const modalProductImage = document.getElementById('modal-product-image-popular');
    const modalProductDescription = document.getElementById('modal-product-description-popular');
    const modalProductPrice = document.getElementById('modal-product-price-popular');
    const modalDecreaseQuantity = document.getElementById('modal-decrease-quantity-popular');
    const modalProductQuantity = document.getElementById('modal-product-quantity-popular');
    const modalIncreaseQuantity = document.getElementById('modal-increase-quantity-popular');
    const modalAddToCartButton = document.getElementById('modal-add-to-cart-button-popular');

    let currentProduct = null;
    let currentQuantity = 1;

    function openModal(product) {
        if (!productModal || !product) return;
        currentProduct = product;
        currentQuantity = 1; // Reset quantity

        if (modalProductName) modalProductName.textContent = product.name;
        if (modalProductClassification) modalProductClassification.textContent = product.classification;
        if (modalProductImage) {
            modalProductImage.src = product.image || 'https://via.placeholder.com/400x300.png?text=Producto';
            modalProductImage.alt = product.name;
        }
        if (modalProductDescription) modalProductDescription.textContent = product.description || 'Descripción no disponible.';
        if (modalProductPrice) modalProductPrice.textContent = formatCurrency(product.price);
        if (modalProductQuantity) modalProductQuantity.textContent = currentQuantity;

        productModal.classList.remove('hidden');
        productModal.classList.add('flex'); // Asegura que sea visible y centrado
        document.body.classList.add('modal-open'); // Para evitar scroll del body si es necesario
    }

    function closeModal() {
        if (!productModal) return;
        productModal.classList.add('hidden');
        productModal.classList.remove('flex');
        document.body.classList.remove('modal-open');
        currentProduct = null;
        currentQuantity = 1;
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    if (productModal) {
        productModal.addEventListener('click', (event) => {
            if (event.target === productModal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !productModal.classList.contains('hidden')) {
            closeModal();
        }
    });

    if (modalDecreaseQuantity) {
        modalDecreaseQuantity.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                if (modalProductQuantity) modalProductQuantity.textContent = currentQuantity;
            }
        });
    }

    if (modalIncreaseQuantity) {
        modalIncreaseQuantity.addEventListener('click', () => {
            currentQuantity++;
            if (modalProductQuantity) modalProductQuantity.textContent = currentQuantity;
        });
    }

    if (modalAddToCartButton) {
        modalAddToCartButton.addEventListener('click', () => {
            if (currentProduct && typeof window.addToCart === 'function') {
                const productToAdd = { ...currentProduct };
                window.addToCart(productToAdd, currentQuantity);
                closeModal();
            } else {
                console.error('Producto actual no definido o función addToCart no disponible.');
            }
        });
    }

    window.openPopularProductModal = openModal;
});

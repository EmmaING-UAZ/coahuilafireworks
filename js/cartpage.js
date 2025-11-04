document.addEventListener('DOMContentLoaded', () => {
    const cartSummaryContainer = document.getElementById('cart-summary-container');
    const generatePdfButton = document.getElementById('generate-pdf-button');
    const citySelector = document.getElementById('city');

    // CAMBIO CRÍTICO: Nuevo nombre para localStorage para evitar conflictos
    let cart = JSON.parse(localStorage.getItem('coahuilaFireworksCart')) || [];

    function renderCartSummary() {
        if (!cartSummaryContainer) return;

        if (cart.length === 0) {
            cartSummaryContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Tu carrito está vacío.</p>';
            if(generatePdfButton) generatePdfButton.disabled = true;
            updateHeaderCartCount();
            return;
        }

        if(generatePdfButton) generatePdfButton.disabled = false;

        let subtotalProducts = 0;
        let summaryHtml = `
            <div class="summary-table-header hidden md:grid">
                <div class="header-cell">Producto</div>
                <div class="header-cell text-center">Precio</div>
                <div class="header-cell text-center">Cantidad</div>
                <div class="header-cell text-right">Subtotal</div>
                <div class="header-cell text-center">Acciones</div>
            </div>
            <div class="summary-table-body">
        `;

        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotalProducts += itemSubtotal;
            summaryHtml += `
                <div class="summary-table-row" data-id="${item.id}">
                    <div class="table-cell" data-label="Producto">
                        <div class="flex items-center">
                            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-4 block">
                            <span>${item.name}</span>
                        </div>
                    </div>
                    <div class="table-cell" data-label="Precio">${formatCurrency(item.price)}</div>
                    <div class="table-cell" data-label="Cantidad">
                        <div class="flex items-center justify-end md:justify-center">
                            <button class="quantity-change-btn decrease-quantity" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
                            <span class="quantity-value mx-3">${item.quantity}</span>
                            <button class="quantity-change-btn increase-quantity" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                        </div>
                    </div>
                    <div class="table-cell text-right md:text-right" data-label="Subtotal">${formatCurrency(itemSubtotal)}</div>
                    <div class="table-cell" data-label="Acciones">
                         <div class="flex items-center justify-end md:justify-center">
                            <button class="remove-item-btn" data-id="${item.id}" aria-label="Eliminar producto">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        const selectedCity = citySelector ? citySelector.value : "";
        let shippingCost = 0;
        // NOTA: Querrás cambiar esto a ciudades de Coahuila
        if (selectedCity === 'Zacatecas') {
            shippingCost = 30;
        } else if (selectedCity === 'Guadalupe') {
            shippingCost = 50;
        }

        const total = subtotalProducts + shippingCost;

        summaryHtml += `
            </div>
            <div class="summary-table-footer">
                <div class="footer-item">
                    <span class="footer-label">Subtotal:</span>
                    <span class="footer-value">${formatCurrency(subtotalProducts)}</span>
                </div>
                <div class="footer-item">
                    <span class="footer-label">Envío:</span>
                    <span class="footer-value">${formatCurrency(shippingCost)}</span>
                </div>
                <div class="footer-item total-row">
                    <span class="footer-label">Total:</span>
                    <span class="footer-value">${formatCurrency(total)}</span>
                </div>
            </div>
        `;
        cartSummaryContainer.innerHTML = summaryHtml;
        updateHeaderCartCount();
    }

    if (citySelector) {
        citySelector.addEventListener('change', renderCartSummary);
    }

    function updateHeaderCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountDesktop = document.getElementById('cart-count-desktop');
        const cartCountMobile = document.getElementById('cart-count-mobile');
        if (cartCountDesktop) cartCountDesktop.textContent = totalItems;
        if (cartCountMobile) cartCountMobile.textContent = totalItems;
    }

    function addCartActionListeners() {
        if (!cartSummaryContainer) return;

        cartSummaryContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const productId = button.dataset.id;
            if (!productId) return;

            const itemIndex = cart.findIndex(i => i.id === productId);
            if (itemIndex === -1) return;

            if (button.classList.contains('increase-quantity')) {
                cart[itemIndex].quantity++;
            } else if (button.classList.contains('decrease-quantity')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }
            } else if (button.classList.contains('remove-item-btn')) {
                cart.splice(itemIndex, 1);
            }

            // CAMBIO CRÍTICO: Guardar en el nuevo nombre de localStorage
            localStorage.setItem('coahuilaFireworksCart', JSON.stringify(cart));

            renderCartSummary();
        });
    }

    if (generatePdfButton) {
        generatePdfButton.addEventListener('click', () => {
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const city = citySelector ? citySelector.value : "";
            const address = document.getElementById('address').value.trim();

            if (!name || !phone || !address || !city) {
                Swal.fire({
                    icon: 'error',
                    title: 'Formulario Incompleto',
                    text: 'Por favor, complete todos los campos de información de entrega, incluyendo la ciudad.',
                    confirmButtonColor: '#fBBF24'
                });
                return;
            }

            // ... (Resto de validaciones de formulario...)

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // CAMBIO: Título del PDF
            doc.setFontSize(18);
            doc.setTextColor(255, 0, 0); // Rojo
            doc.text("Coahuila Fireworks", 105, 20, { align: "center" });

            // Subtítulo
            doc.setFontSize(20);
            doc.setTextColor(0, 0, 0);
            doc.text("Resumen del Pedido", doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

            // Datos del cliente
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Nombre: " + name, 14, 40);
            doc.text("Teléfono: " + phone, 14, 46);
            doc.text("Ciudad de Entrega: " + city, 14, 52);
            doc.text("Dirección: " + address, 14, 58);

            // Tabla
            const tableColumn = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
            const tableRows = [];

            let subtotalProducts = 0;

            cart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                tableRows.push([
                    item.name,
                    item.quantity,
                    `$${item.price.toFixed(2)}`,
                    `$${itemSubtotal.toFixed(2)}`
                ]);
                subtotalProducts += itemSubtotal;
            });

            doc.autoTable(tableColumn, tableRows, { startY: 65 });

            let finalY = doc.autoTable.previous.finalY;

            let shippingCost = 0;
            // NOTA: Actualizar esto
            if (city === 'Zacatecas') {
                shippingCost = 30;
            } else if (city === 'Guadalupe') {
                shippingCost = 50;
            }
            const total = subtotalProducts + shippingCost;

            doc.setFontSize(12);
            doc.setTextColor(0,0,0);
            doc.text(`Subtotal:`, 120, finalY + 10, { align: 'left' });
            doc.text(`${formatCurrency(subtotalProducts)}`, 170, finalY + 10, { align: 'right' });

            doc.text(`Costo de Envío:`, 120, finalY + 17, { align: 'left' });
            doc.text(`${formatCurrency(shippingCost)}`, 170, finalY + 17, { align: 'right' });

            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Total:`, 120, finalY + 25, { align: 'left' });
            doc.text(`${formatCurrency(total)}`, 170, finalY + 25, { align: 'right' });

            // CAMBIO: Nombre del archivo PDF
            doc.save('resumen-pedido-coahuilafireworks.pdf');

            // CAMBIO CRÍTICO: Limpiar el carrito correcto
            localStorage.removeItem('coahuilaFireworksCart');
            
            // CAMBIO: Redirigir a catalogo.html (la nueva tienda)
            window.location.href = 'catalogo.html';
        });
    }

    // Inicializar la página del carrito
    renderCartSummary();
    addCartActionListeners();

});

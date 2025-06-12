const baseDatosGaming = [
  {
    categoria: "periféricos",
    productos: [
      { nombre: "Auriculares Gamer RGB", precio: 12000, descuento: 0.8, img: "https://http2.mlstatic.com/D_NQ_NP_909564-MLU72576025782_112023-O.webp" },
      { nombre: "Mouse Gaming Pro", precio: 8500, descuento: 0.9, img: "https://manuals.plus/wp-content/uploads/2022/04/REDRAGON-M810-Taipan-Pro-Wired-and-Wireless-Gaming-Mouse.jpg" },
      { nombre: "Teclado Mecánico RGB", precio: 15000, descuento: 0.85, img: "https://intercompras.com/images/product/NACEB_CH-9101020-SP.jpg" }
    ]
  },
  {
    categoria: "hardware",
    productos: [
      { nombre: "Laptop Gaming RGB", precio: 450000, descuento: 0.9, img: "https://i5.walmartimages.com/seo/MSI-GL63-Gaming-Laptop-15-6-Intel-Core-i7-8750H-NVIDIA-GeForce-GTX-1050-8gb-RAM-256gb-SSD-1TB-HDD_3a04f0fc-6fed-4b52-912c-11317e493ad1_1.9e46d617254b76bff5a4cda944922f78.jpeg" },
      { nombre: "Gabinete RGB", precio: 25000, descuento: 0.85, img: "https://hard-digital.com.ar/public/files/Gabinete%20Ic3%20Adventure%20S17-5%20Rojo%20Bionic%206%20Fan%20Rojo%20Negro%20Mid%20Tower/1.webp" }
    ]
  },
  {
    categoria: "accesorios",
    productos: [
      { nombre: "Silla Gamer Ergonómica", precio: 95000, descuento: 0.85, img: "https://http2.mlstatic.com/D_NQ_NP_859999-MLA81007741997_112024-O.webp" }
    ]
  }
];

let carritoCompras = [];

function mostrarCategorias() {
  const categoriasContainer = document.getElementById("categorias");
  categoriasContainer.innerHTML = baseDatosGaming.map(cat => `
    <div class="col-md-4 mb-3">
      <div class="categoria-card" onclick="filtrarProductos('${cat.categoria}')">
        <h3>${cat.categoria.toUpperCase()}</h3>
        <p>${cat.productos.length} productos disponibles</p>
      </div>
    </div>
  `).join('');
}

// Función para mostrar productos
function mostrarProductos(productos) {
  const productosContainer = document.getElementById('productos');
  productosContainer.innerHTML = productos.map(prod => {
    const idSeguro = prod.nombre.replace(/\s+/g, '_').toLowerCase();
    const precioFinal = Math.round(prod.precio * prod.descuento);
    return `
      <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <div class="producto-card">
          <img src="${prod.img}" alt="${prod.nombre}" class="producto-img">
          <h4 class="producto-nombre">${prod.nombre}</h4>
          <div class="producto-precio">$${precioFinal.toLocaleString()}</div>
          
          <div class="cantidad-control">
            <button onclick="modificarCantidad('${idSeguro}', -1)" class="cantidad-btn">-</button>
            <span id="cantidad-${idSeguro}" class="cantidad-display">1</span>
            <button onclick="modificarCantidad('${idSeguro}', 1)" class="cantidad-btn">+</button>
          </div>
          
          <button onclick='agregarAlCarrito(${JSON.stringify({...prod, precio: precioFinal})}, obtenerCantidad("${idSeguro}"))' 
                  class="agregar-carrito-btn">
            🛒 Añadir al Carrito
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function modificarCantidad(idSeguro, delta) {
  const cantidadSpan = document.getElementById(`cantidad-${idSeguro}`);
  let cantidad = parseInt(cantidadSpan.innerText) + delta;
  if (cantidad < 1) cantidad = 1;
  cantidadSpan.innerText = cantidad;
}


function obtenerCantidad(idSeguro) {
  return parseInt(document.getElementById(`cantidad-${idSeguro}`).innerText);
}


function filtrarProductos(categoria) {
  const categoriaSeleccionada = baseDatosGaming.find(cat => cat.categoria === categoria);
  mostrarProductos(categoriaSeleccionada.productos);
  
  // Actualizar estilos de categorías
  document.querySelectorAll('.categoria-card').forEach(el => {
    el.classList.remove('categoria-activa');
  });
  
  const categoriaActiva = Array.from(document.querySelectorAll('.categoria-card')).find(el => 
    el.innerText.toLowerCase().includes(categoria)
  );
  if (categoriaActiva) {
    categoriaActiva.classList.add('categoria-activa');
  }
}

// Funciones del carrito
function abrirCarrito() {
  document.getElementById('modalCarrito').classList.remove('d-none');
}

function cerrarCarrito() {
  document.getElementById('modalCarrito').classList.add('d-none');
}

function agregarAlCarrito(producto, cantidad = 1) {
  const productoExistente = carritoCompras.find(item => item.nombre === producto.nombre);

  if (productoExistente) {
    productoExistente.cantidad += cantidad;
  } else {
    carritoCompras.push({ ...producto, cantidad });
  }

  actualizarCarrito();
  
}

function actualizarCarrito() {
  const contenidoCarrito = document.getElementById('contenidoCarrito');
  const contadorCarrito = document.getElementById('contadorCarrito');
  
  if (carritoCompras.length === 0) {
    contenidoCarrito.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>';
  } else {
    let html = '';
    
    carritoCompras.forEach(item => {
      html += `
        <div class="carrito-item">
          <button onclick="eliminarProductoDelCarrito('${item.nombre}')" class="carrito-eliminar">×</button>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1">${item.nombre}</h6>
              <small>Precio unitario: $${item.precio.toLocaleString()}</small>
            </div>
            <div class="text-end">
              <div class="d-flex align-items-center justify-content-end mb-2">
                <button onclick="cambiarCantidad('${item.nombre}', -1)" class="btn btn-sm btn-outline-light">-</button>
                <span class="mx-2">${item.cantidad}</span>
                <button onclick="cambiarCantidad('${item.nombre}', 1)" class="btn btn-sm btn-outline-light">+</button>
              </div>
              <strong>$${(item.precio * item.cantidad).toLocaleString()}</strong>
            </div>
          </div>
        </div>
      `;
    });
    
    contenidoCarrito.innerHTML = html;
  }

  const total = carritoCompras.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById('totalCarrito').innerText = total.toLocaleString();


  const totalItems = carritoCompras.reduce((sum, item) => sum + item.cantidad, 0);
  if (totalItems > 0) {
    contadorCarrito.classList.remove('d-none');
    contadorCarrito.innerText = totalItems;
  } else {
    contadorCarrito.classList.add('d-none');
  }
}

function limpiarCarritoCompleto() {
      carritoCompras = [];
      actualizarCarrito();
    }

function eliminarProductoDelCarrito(nombre) {
  carritoCompras = carritoCompras.filter(item => item.nombre !== nombre);
  actualizarCarrito();
}

function cambiarCantidad(nombre, delta) {
  const producto = carritoCompras.find(item => item.nombre === nombre);
  if (producto) {
    producto.cantidad += delta;
    if (producto.cantidad <= 0) {
      carritoCompras = carritoCompras.filter(item => item.nombre !== nombre);
    }
    actualizarCarrito();
  }
}

function finalizarCompra() {
  if (carritoCompras.length === 0) {
    Swal.fire('Carrito vacío', 'Agrega productos antes de comprar', 'info');
    return;
  }

  const resumenCompra = carritoCompras.map(item => 
    `${item.nombre} (x${item.cantidad}): $${(item.precio * item.cantidad).toLocaleString()}`
  ).join('\n');

  const total = carritoCompras.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  Swal.fire({
    title: '🛒 Resumen de Compra',
    html: `<pre style="text-align: left; font-size: 14px;">${resumenCompra}</pre><br><strong>Total: $${total.toLocaleString()}</strong>`,
    showCancelButton: true,
    confirmButtonText: '💳 Confirmar Compra',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#28a745'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Procesando compra...',
        html: 'Por favor espere un momento.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        willClose: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Compra Confirmada! 🎉',
            html: `
              <p><strong>Tu pedido llegará en las próximas 24-48 horas</strong></p>
              <p>Para consultas, contáctanos al: <strong>0800-1923</strong></p>
            `,
            confirmButtonText: 'confirmar'
          }).then(() => {
            carritoCompras = [];
            actualizarCarrito();
            cerrarCarrito();
          });
        }
      });
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {
  mostrarCategorias();
  mostrarProductos(baseDatosGaming.flatMap(cat => cat.productos));
  actualizarCarrito();
});
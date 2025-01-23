const borrarProducto = async (cartId, productId) => {
    const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {method: 'DELETE'})
    mostrarCart()
}

const agregarProducto = async (productId, cantidad = 1) => {
    const responseCart = await fetch(`http://localhost:8080/api/carts`)
    const dataCart = await responseCart.json()


    const productos = [{ product: productId, cantidad }];

    const response = await fetch(`http://localhost:8080/api/carts/${dataCart.response[0]._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ products: productos }),
    })

    const data = await response.json();

    mostrarCart()
}


const modificarCantidad = async (cartId, productId, nuevaCantidad) => {

    if (nuevaCantidad <= 0) {return console.log("La cantidad no puede ser menos a 1")}

    const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ cantidad: nuevaCantidad }),
    })
    mostrarCart()
}

const borrarTodo = async (cartId) => {
    const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, { method: 'DELETE' })
    mostrarCart()
}


const detalleCarrito = document.querySelector('#detalleCarrito')

const mostrarCart = async () => {

    const response = await fetch(`http://localhost:8080/api/carts`)
    const data = await response.json()

    detalleCarrito.innerHTML = `<h4>Carro de Compras</h4><ul id="cartLista" class="list-group">
    <button class="btn btn-danger btn-sm" onclick="borrarTodo('${data.response[0]._id}')">Borrar Todo</button>`;

    data.response[0].products.forEach((item) => {

        const tarjetaProduct = `
                <li class="list-group-item d-flex align-items-center border">
                    <img src="${item.product.imagen}" alt="${item.product.titulo}" class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <div class="flex-grow-1">
                        <p class="mb-1" style="font-size: 0.9rem; font-weight: bold;">${item.product.titulo}</p>
                        <p class="mb-0" style="font-size: 0.8rem; color: gray;">Precio: $${item.product.precio.toLocaleString('es-CL')}</p>
                        <div class="d-flex align-items-center mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2" onclick="modificarCantidad('${data.response[0]._id}', '${item.product._id}', ${item.cantidad - 1})">-</button>
                            <span>${item.cantidad}</span>
                            <button class="btn btn-sm btn-outline-primary ms-2" onclick="modificarCantidad('${data.response[0]._id}', '${item.product._id}', ${item.cantidad + 1})">+</button>
                        </div>
                    </div>
                    <button class="btn btn-danger btn-sm ms-3" onclick="borrarProducto('${data.response[0]._id}', '${item.product._id}')">Borrar</button>
                </li>`;

        detalleCarrito.innerHTML += tarjetaProduct;
    })

    detalleCarrito.innerHTML += `</ul><div class="mt-3"><strong>Total: $${data.response[0].monto}</strong></div>
                                <div class="mt-3 text-center">
                                    <button id="btnComprar" class="btn btn-success btn-lg">Comprar</button>
                                </div>`
}

mostrarCart()


const contenedor = document.querySelector('#contenedor')

const traerProductos = async (page, category = '', sort = '') => {

    let url = `http://localhost:8080/api/product?page=${page}&limit=10`
    if (category) url += `&categoria=${category}`
    if (sort) url += `&sort=${sort}`

    const response = await fetch(url)
    const data = await response.json()

    contenedor.innerHTML = ''

    data.response.payload.forEach((product) => {

        const tarjetaProduct =  `<div class="col">
                                    <div class="card h-100" style="width: 12rem;"> <!-- Tamaño de tarjeta reducido -->
                                        <div class="d-flex align-items-center justify-content-center" style="height: 120px; overflow: hidden;"> <!-- Imagen centrada -->
                                            <img src="${product.imagen}" alt="${product.titulo}" style="max-height: 100%; max-width: 100%;">
                                        </div>
                                        <div class="card-body p-2">
                                            <h6 class="card-title" style="font-size: 0.9rem;">${product.titulo}</h6>
                                            <p class="card-text" style="font-size: 0.8rem;">${product.description}</p> <!-- Texto completo -->
                                            <p class="text-muted" style="font-size: 0.7rem;">Categoría: ${product.categoria}</p>
                                            <p style="font-size: 0.8rem;">Precio: $${product.precio}</p>
                                            ${product.descuento ? `<p class="text-success" style="font-size: 0.8rem;">Oferta: $${product.precioDescuento.toLocaleString('es-CL')}</p>` : ''}
                                            <a href="http://localhost:8080/products/${product._id}"><button class="btn btn-primary btn-sm">Ver</button></a>
                                            <button class="btn btn-primary btn-sm" onclick="agregarProducto('${product._id}', 1)">Comprar</button>
                                        </div>
                                    </div>
                                </div>`

        contenedor.innerHTML += tarjetaProduct;
    })
    Paginacion(page, category, data.response.totalPages, data.response.prevPage, data.response.nextPage, sort);
}

const ltsPaginacion = document.querySelector('#ltsPaginacion')

const Paginacion = (page, category, totalPages, prevPage, nextPage, sort) => {
    ltsPaginacion.innerHTML = '';

    if (prevPage) {ltsPaginacion.innerHTML += `<li class="page-item"><button class="page-link" onclick="traerProductos(${prevPage}, '${category}', '${sort}')">Anterior</button></li>`}

    for (let index = 1; index <= totalPages; index++) {
        ltsPaginacion.innerHTML += `<li class="page-item ${index === page ? 'active' : ''}">
                                        <button class="page-link" onclick="traerProductos(${index}, '${category}', '${sort}')">${index}</button>
                                    </li>`;
    }

    if (nextPage) {ltsPaginacion.innerHTML += `<li class="page-item"><button class="page-link" onclick="traerProductos(${nextPage}, '${category}', '${sort}')">Siguiente</button></li>`;}
}







const buttonFilter = document.querySelector('#btnBuscarProduto')

buttonFilter.addEventListener('click', async () => {

    try {
        const inputValue = document.querySelector('#inputFiltro')
        if(inputValue){
            const response = await fetch('http://localhost:8080/api/product?titulo='+inputValue.value)
            const data = await response.json()

            contenedor.innerHTML = ''
            
            data.response.payload.forEach((product) => {
                const tarjetaProduct =  `<div class="col">
                                            <div class="card h-100" style="width: 12rem;"> <!-- Tamaño de tarjeta reducido -->
                                                <div class="d-flex align-items-center justify-content-center" style="height: 120px; overflow: hidden;"> <!-- Imagen centrada -->
                                                    <img src="${product.imagen}" alt="${product.titulo}" style="max-height: 100%; max-width: 100%;">
                                                </div>
                                                <div class="card-body p-2">
                                                    <h6 class="card-title" style="font-size: 0.9rem;">${product.titulo}</h6>
                                                    <p class="card-text" style="font-size: 0.8rem;">${product.description}</p> <!-- Texto completo -->
                                                    <p class="text-muted" style="font-size: 0.7rem;">Categoría: ${product.categoria}</p>
                                                    <p style="font-size: 0.8rem;">Precio: $${product.precio.toLocaleString('es-CL')}</p>
                                                    ${product.descuento ? `<p class="text-success" style="font-size: 0.8rem;">Oferta: $${product.precioDescuento.toLocaleString('es-CL')}</p>` : ''}
                                                    <button class="btn btn-primary btn-sm">Agregar</button>
                                                </div>
                                            </div>
                                        </div>`
        
                contenedor.innerHTML += tarjetaProduct;
            })

            Paginacion(data.response.page, data.response.payload.categoria, data.response.totalPages, data.response.prevPage, data.response.nextPage, 'asc')
        }
        
    } catch (error) {
        console.log(error)
    }
})


const SelectCategoria = document.querySelector('#sltCategoria')
const SelectOrden = document.querySelector('#sltOrden')

SelectCategoria.addEventListener('change', async () => {
    const categoriaSeleccionada = SelectCategoria.value
    const ordenSeleccionado = SelectOrden.value

    console.log("Categoría seleccionada:", categoriaSeleccionada, "Orden seleccionado:", ordenSeleccionado)

    if (categoriaSeleccionada !== 'nada' && ordenSeleccionado !== 'nada') {
        traerProductos(1, categoriaSeleccionada, ordenSeleccionado)
    } else if (categoriaSeleccionada !== 'nada') {
        traerProductos(1, categoriaSeleccionada, '');
    } else {
        console.log('No se seleccionó ninguna categoría.')
    }
})

SelectOrden.addEventListener('change', async () => {
    const categoriaSeleccionada = SelectCategoria.value
    const ordenSeleccionado = SelectOrden.value

    console.log("Categoría seleccionada:", categoriaSeleccionada, "Orden seleccionado:", ordenSeleccionado)

    if (ordenSeleccionado !== 'nada' && categoriaSeleccionada !== 'nada') {
        traerProductos(1, categoriaSeleccionada, ordenSeleccionado)
    } else if (ordenSeleccionado !== 'nada') {
        traerProductos(1, '', ordenSeleccionado)
    } else {
        console.log('No se seleccionó ningún orden.')
    }
})

const btnQuitarFiltros = document.querySelector('#btnQuitarFiltros')

btnQuitarFiltros.addEventListener('click', async () => {
    traerProductos(1,'')
})

traerProductos(1,'')

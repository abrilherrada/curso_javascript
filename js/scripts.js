/**
 * @challenge:
 * DESAFÍO:
 * Tomando como ejemplo la llamada AJAX con JSON, incorpora al proyecto del simulador al menos una llamada AJAX, que mediante la interacción del usuario (un botón o envío de formulario), se realice la llamada y la misma responda un JSON estático. incluir esa respuesta en el HTML.
 * 
 * TERCERA PREENTREGA:
 *  - Maquetación del HTML y eventos a manejar en él.
 *  - Incorporación de jQuery para acceder y agregar elementos al DOM.
 *  - Implementación de efectos y animaciones. 
 *  - Estilos base CSS del simulador.
 * 
 * @version: 1.11.0
 * @author: Abril Herrada
 * @date: 20/01/2022
 *
 * History:
 *  - v1.0.0: Primera entrega (Sintaxis y variables)
 *  - v1.1.0: Segunda entrega (Control de flujos)
 *  - v1.2.0: Tercera entrega (Ciclos/iteraciones)
 *  - v1.3.0: Cuarta entrega (Funciones)
 *  - v1.4.0: Quinta entrega (Objetos)
 *  - v1.5.0: Sexta entrega (Arrays, Primera preentrega)
 *  - v1.6.0: Séptima entrega (DOM)
 *  - v1.7.0: Octava entrega (Eventos)
 *  - v1.8.0: Novena entrega (Segunda preentrega)
 *  - v1.9.0: Décima entrega (jQuery: selectores y eventos)
 *  - v1.10.0: Decimoprimera entrega (jQuery: efectos y animaciones)
 *  - v1.11.0: Decimosegunda entrega (AJAX, Tercera preentrega)
 */

//CLASE DE PRODUCTOS EN CARRITO
class ProductsInCart {
    constructor (id, name, price, quantity) {
        this.id = parseInt(id);
        this.name = name;
        this.price = parseInt(price);
        this.quantity = parseInt(quantity);
        this.modifyQuantity = (quantity) => {
            this.quantity += quantity;
        }
    }
}

//ARRAYS
let products = [];
let cart = [];
let filteredProducts = [];

//VARIABLES GLOBALES
//Variable para establecer el porcentaje de descuento a aplicar cuando el monto supera los $10.000.
const discountPercentage = 25;

//Variables para el modal de carrito, el botón del carrito y el botón de cerrar el modal de carrito.
let cartModal = document.getElementById("cartModal");
let cartBtn = document.getElementById("cartBtn");
let closeModal1 = document.getElementsByClassName("close")[0];

//Variables para el modal de compra realizada, el botón de pagar y el botón de cerrar el modal de compra.
let payModal = document.getElementById("payModal");
let payBtn = document.getElementById("payBtn");
let closeModal2 = document.getElementsByClassName("close")[1];

//Variables para el modal de cantidad inválida y el botón de cerrar el modal de cantidad inválida.
let invalidModal = document.getElementById("invalidModal");
let closeModal3 = document.getElementsByClassName("close")[2];

//Variables para las pestañas de productos filtrados.
let allTab = document.getElementById("tab1");
let outdoorsTab = document.getElementById("tab2");
let homeTab = document.getElementById("tab3");
let toysTab = document.getElementById("tab4");

//FUNCIONES
//Función que genera el código HTML de las cartas de productos en función de la categoría seleccionada y hace una llamada a la función que genera los addEventListener de los botones Agregar.
const productCards = (productCategory) => {
    document.getElementById("productCards").innerHTML = "";
    if (productCategory == "todos") {
        filteredProducts = products;
    }
    else {
        filteredProducts = products.filter(item => item.category == productCategory);
    }
    filteredProducts.forEach(item => {
        $("#productCards").append(`<div class="col mb-5">
                                    <div class="card h-100">
                                        <img class="card-img-top img-product" src="./media/p${item.id}.jpg" alt="${item.name}" />
                                        <div class="card-body p-4">
                                            <div class="text-center">
                                                <h5 class="fw-bolder">${item.name}</h5>
                                                <p class="card-text">$${item.price}</p>
                                                <p class="card-text description-product">${item.description}</p>
                                            </div>
                                        </div>
                                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent d-flex justify-content-between">
                                            <input id="productQuantity${item.id}" type="number" value=0 min="1" max="${item.stock}" class="mb-3 input-quantity m-1">
                                            <div class="text-center"><button data-productid="${item.id}" class="btn btn-outline-dark m-1 addBtn">Agregar</button></div>
                                        </div>
                                    </div>
                                </div>`);
        $(`#productCards`).hide();
        $(`#productCards`).fadeIn("slow");
    });
    createEventListener();
}

//Función que genera el addEventListener de los botones Agregar.
const createEventListener = () => {
    let addBtns = document.getElementsByClassName("addBtn");
    for (const btn of addBtns) {
        btn.addEventListener("click", (e) => {
            addToCart(e, btn.dataset.productid);
        });
    }
}

//Función que evalúa si el carrito ya contiene el producto.
const checkCart = (id) => {
    return cart.some(item => item.id == id);
}

//Función que muestra un modal que indica que la cantidad seleccionada es inválida e indica cuántas unidades puede agregar el usuario.
const invalidQuantityModal = (stock, quantity, type) => {
    let invalidQuantity;
    if (type === 'insuficiente') {
        switch (stock - quantity) {
            case 0:
                invalidQuantity = `<p>Ya no tenemos stock de este producto.</p>`;
                break;
            case 1:
                invalidQuantity = `<p>La cantidad que ingresaste supera nuestro stock. Solo queda 1 unidad disponible.</p>`;
                break;
            default:
                invalidQuantity = `<p>La cantidad que ingresaste supera nuestro stock. Agregá ${stock - quantity} unidades o menos.</p>`;
                break;
        }
    }
    else if (type === 'inválido') {
        invalidQuantity = `<p>Ingresá una cantidad válida para agregar el producto al carrito.</p>`;
    }
    document.getElementById("invalidModalBody").innerHTML = invalidQuantity;
    invalidModal.className = "popUp shown";
}

//Función que agrega los productos al array del carrito y hace un llamado a la función que genera el resumen de compra.
const addToCart = (e, id) => {
    let quantity = parseInt(document.getElementById(`productQuantity${id}`).value);
    //Condicional que evalúa si la cantidad es válida. Si lo es, agrega el producto y lo guarda en el local storage. Si no es válida, le avisa al usuario mediante una notificación.
    if (quantity > 0) {
        //Condicional que evalúa si el producto ya está en el array de carrito. Si está, modifica el valor de la propiedad cantidad. Si no está, lo agrega.
        switch (checkCart(id)) {
            case true:
                let productIndex = cart.findIndex(item => item.id == id);
                //Condicional que evalúa si hay suficientes productos en stock. Si no hay, le avisa al usuario. Si hay, agrega la cantidad seleccionada al carrito.
                if (quantity > products[id - 1].stock - cart[productIndex].quantity) {
                    //Notificación de stock insuficiente.
                    invalidQuantityModal(products[id - 1].stock, cart[productIndex].quantity, 'insuficiente');
                }
                else {
                    cart[productIndex].modifyQuantity(quantity);
                    //Notificación de producto agregado.
                    added(e, id);
                }
                break;
            case false:
                //Condicional que evalúa si hay suficientes productos en stock. Si no hay, le avisa al usuario. Si hay, agrega el producto al carrito.
                if (quantity > products[id - 1].stock) {
                    //Notificación de stock insuficiente.
                    invalidQuantityModal(products[id - 1].stock, 0, 'insuficiente');
                }
                else {
                    cart.push(new ProductsInCart (products[id - 1].id, products[id - 1].name, products[id - 1].price, quantity));
                    //Notificación de producto agregado.
                    added(e, id);
                }
                break;
        }
        //Ordena alfabéticamente los objetos de productos en el carrito. 
        cart.sort((product1, product2) => (product1.name < product2.name) ? -1 : 1);
        //Guarda el array de carrito en el local storage.
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    else {
        invalidQuantityModal(0, 0, 'inválido');
    }
    //Llama a la función que genera el resumen de compra.
    purchaseSummary();
    //Resetea el valor del input.
    document.getElementById(`productQuantity${id}`).value = 0;
}

//Función que muestra y oculta una notificación cuando el usuario agrega un producto al carrito.
const added = (e, id) => {
    $(e.target).parent().parent().parent().append(`<p id="added${id}" class="align-self-center notification${id}">Producto agregado <i class="fas fa-check"></i></p>`);
    $('.fa-check').css('color', 'green');
    $(`#added${id}`).hide()
                .slideDown("slow")
                .delay(4000)
                .slideUp("slow", () => {
                    $(`.notification${id}`).remove()
                });
}

//Función que calcula el total sin descuento y el total con descuento de los productos en el carrito, y los guarda en un objeto.
const calculateTotal = () => {
    let fullTotal = 0;
    let discountedTotal = 0;
    for (const item of cart) {
        fullTotal += item.price * item.quantity;
    }
    //Condicional que evalúa si corresponde el descuento y lo aplica al total a pagar.
    if (fullTotal >= 10000) {
        discountedTotal = fullTotal * ((100 - discountPercentage) / 100);
    }
    else if (fullTotal > 0 && fullTotal < 10000) {
        discountedTotal = fullTotal;
    }
    return {fullTotal, discountedTotal};
}

//Función que evalúa si hay productos en el carrito. Si hay, muestra los botones del modal (Vaciar carrito y Pagar), genera el HTML del resumen de compra y aumenta el número en la insignia del botón del carrito. Si no hay productos en el carrito, esconde los botones del modal.
const purchaseSummary = () => {
    let btns = document.getElementById("modalBtns");
    if (cart.length > 0) {
        btns.className = "modal-footer";
        let purchase =
        `<table class="table">
            <thead>
                <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Total del producto</th>
                </tr>
            </thead>
            <tbody>`;
        cart.forEach(item => {
            purchase +=
            `<tr>
                <th scope="row">${item.name}</th>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${item.price * item.quantity}</td>
            </tr>`;
        });
        purchase +=
        `<tr class="table-active">
            <th scope="row"></th>
            <td></td>
            <td>Total sin descuento</td>
            <td>${calculateTotal().fullTotal}</td>
        </tr>
        <tr class="table-active">
            <th scope="row"></th>
            <td></td>
            <td>Descuento (${discountPercentage}%)</td>
            <td>- ${calculateTotal().fullTotal - calculateTotal().discountedTotal}</td>
        </tr>
        <tr class="table-active">
            <th scope="row"></th>
            <td></td>
            <td><strong>Total final</strong></td>
            <td>${calculateTotal().discountedTotal}</td>
        </tr>
        </tbody>
        </table>`;
        document.getElementById("cartSummary").innerHTML = purchase;
        let badge = cart.length;
        document.getElementById("badge").innerText = badge;
    }
    else {
        btns.className = "hidden";
    }
}

//Función que redirige al usuario a Mercado Pago.
const pay = () => {
    let payment = [{
        title: 'Productos varios',
        description: '',
        picture_url: '',
        category_id: '',
        quantity: 1,
        currency_id: "ARS",
        unit_price: calculateTotal().discountedTotal,
    }];
    $.ajax({
        method: "POST",
        url: "https://api.mercadopago.com/checkout/preferences",
        headers: {
            Authorization: "Bearer TEST-518072296284558-042320-fe06c7a6491e260a2bef78daad3b3325-57629816",
            },
        data: JSON.stringify({
            items: payment,
        }),
        success: function (response) {
            const data = response;
            window.open(data.init_point, "_blank")
        }
    })
}

//Función que vacía el array de carrito, muestra un mensaje en el modal del resumen de compra, esconde los botones del modal, resetea el número en la insignia del botón del carrito y borra el carrito del local storage.
const clearCart = () => {
    cart = [];
    let cleared = 
    `<p>Todavía no agregaste productos a tu carrito.</p>`;
    document.getElementById("cartSummary").innerHTML = cleared;
    let btns = document.getElementById("modalBtns");
    btns.className = "hidden";
    let badge = cart.length;
    document.getElementById("badge").innerText = badge;
    localStorage.removeItem("cart");
}

//Función que guarda los productos de products.json en el array.
const getProducts = async () => {
    try {
        let data = await fetch("js/products.json");
        products = await data.json();
        productCards("todos"); 
    } catch (error) {
        console.log(error);
    }
}

getProducts();

if (localStorage.getItem("cart") !== null) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

cartBtn.addEventListener("click", () => {
    cartModal.className = "popUp shown";
});

closeModal1.addEventListener("click", () => {
    cartModal.className = "popUp hidden";
});

payBtn.addEventListener("click", () => {
    payModal.className = "popUp shown";
    cartModal.className = "popUp hidden";
    cart.forEach(item => {
        products[item.id - 1].stock = parseInt(products[item.id - 1].stock) - item.quantity;
    });
    pay();
    clearCart();
});

closeModal2.addEventListener("click", () => {
    payModal.className = "popUp hidden";
});

closeModal3.addEventListener("click", () => {
    invalidModal.className = "popUp hidden";
});

allTab.addEventListener("click",  () => {
    productCards("todos");
});

outdoorsTab.addEventListener("click", () => {
    productCards("paseo");
});

homeTab.addEventListener("click",  () => {
    productCards("hogar");
});

toysTab.addEventListener("click", () => {
    productCards("juguete");
});

purchaseSummary();

$("#clearBtn").click(clearCart);
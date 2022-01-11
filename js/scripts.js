/**
 * @challenge: Sumar al proyecto integrador los conceptos de jQuery que vimos en las últimas dos clases:
 * - Utilizar métodos jQuery para incorporar elementos al DOM.
 * - Utilizar métodos jQuery para determinar respuesta a ciertos eventos.

 * 
 * @version: 1.9.0
 * @author: Abril Herrada
 * @date: 11/01/2022
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
 */

//CLASE DE PRODUCTO
class Product {
    constructor (id, name, price, description, stock) {
        this.id = parseInt(id);
        this.name = name;
        this.price = parseInt(price);
        this.description = description;
        this.stock = parseInt(stock);
    }
}

//ARRAYS DE PRODUCTOS Y DE CARRITO
const products = [
    new Product ("1", "Collar", "1000", "Este collar tiene una manija que te permite retener a tu perro en caso de emergencia y una traba de seguridad para evitar que se salga.", "5"),
    new Product ("2", "Correa extensible", "5000", "Esta correa es ideal para dejar que tu perro explore. Se puede extender hasta 3 metros y tiene un botón para trabarla en el largo que quieras.", "10"),
    new Product ("3", "Correa cuero", "1500", "Esta correa de 2 metros de largo es la más elegida por nuestros clientes. Es de cuero, lo cual la hace ultraresistente.", "15"),
    new Product ("4", "Plato doble", "2000", "Si estás buscando un plato con estilo para tu perro, este es el producto para vos. Además de su diseño práctico, tiene una base antideslizante para evitar accidentes.", "8"),
    new Product ("5", "Plato lento", "1000", "Si tu amigo de 4 patas es un glotón, este plato es ideal para él. Su diseño permite que tu perro coma más lento y, además, esta actividad ayuda a aliviar el estrés.", "12"),
    new Product ("6", "Pelota", "2200", "¿Tu perro destruye todos sus juguetes? Esta pelota es lo que estás buscando. Es prácticamente indestructible y la favorita de nuestros clientes.", "20"),
    new Product ("7", "Hueso", "1800", "Este hueso ultraresistente es perfecto para los peluditos que aman masticar. Tiene pequeños dientes de goma que ayudan a mantener la higiene dental de tu perro.", "18"),
    new Product ("8", "Cama", "4900", "¿Querés que tu perro duerma como un rey? Nuestra cama es ideal. Está confeccionada con tela antidesgarros que, además, se puede lavar en el lavarropas todas las veces que quieras.", "4"),
    new Product ("9", "Arnés", "4000", "Este arnés supercómodo permite que tu perro disfrute más sus paseos. Tiene cuatro puntos de ajuste regulables, paneles acolchonados suaves y herrajes resistentes a golpes.", "25"),
    new Product ("10", "Soga y pelota", "1100", "¿A tu perro le encanta jugar con vos? Este juguete les va a dar horas de diversión. La soga con manija te permite tener más control sobre el agarre y la pelota de goma soporta las mordidas más fuertes.", "15"),
    new Product ("11", "Peluche", "2500", "Estos adorables peluches están hechos con un forro reforzado para juegos duraderos. Las texturas únicas y variadas intrigan a los perros y promueven el juego activo.", "20"),
    new Product ("12", "Frisbee", "1500", "Regalale una experiencia única a tu perro con este frisbee flexible. No se astilla con las mordidas del perro y tiene un patrón que permite un buen agarre de ambos lados.", "12"),
]
let cart = [];

//Variable global para establecer el porcentaje de descuento a aplicar cuando el monto supera los $10.000.
const discountPercentage = 25;

//FUNCIONES
//Función que genera el código HTML de todas las cartas de productos.
const productCards = () => {
    products.forEach(item => {
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
    });
}

//Función que agrega los productos al array del carrito y hace un llamado a la función que genera el resumen de compra.
const addToCart = (id) => {
    let quantity = document.getElementById(`productQuantity${id}`).value;
    //Condicional que evalúa si la cantidad es válida. Si lo es, agrega el producto al array de carrito y lo guarda en el local storage. Si no es válida, le avisa al usuario mediante un alert.
    if (quantity > 0) {
        cart.push({name: products[id - 1].name, price: products[id - 1].price, quantity: quantity});
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    else {
        alert("Ingresá una cantidad válida para agregar el producto al carrito.");
    }
    purchaseSummary();
}

//Función que calcula el total sin descuento y el total con descuento, y los guarda en un objeto.
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

//Función que, en primer lugar, evalúa si hay productos en el carrito. Si hay, los ordena alfabéticamente, genera el HTML del resumen de compra y aumenta el número en la insignia del botón del carrito. Si no hay productos en el carrito, esconde los botones del modal.
const purchaseSummary = () => {
    let btns = document.getElementById("modalBtns");
    if (cart.length > 0) {
        btns.className = "modal-footer";
        cart.sort((product1, product2) => (product1.name < product2.name) ? -1 : 1);
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

productCards();

if (localStorage.getItem("cart") !== null) {
    cart = JSON.parse(localStorage.getItem("cart"));
}

purchaseSummary();

let addBtns = document.getElementsByClassName("addBtn");
for (const btn of addBtns) {
    btn.addEventListener("click", () => {addToCart(btn.dataset.productid)});
}

$("#clearBtn").click(clearCart);
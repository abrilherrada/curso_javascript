/**
 * @challenge:
 * DESAFÍO:
 * Con lo que vimos sobre DOM, ahora puedes sumarlo a tu proyecto, para interactuar entre los elementos HTML y JS. Es decir, asociar eventos que buscamos controlar sobre los elementos  de la interfaz de nuestro simulador.
 * 
 * DESAFÍO COMPLEMENTARIO:
 * Codifica un script cuyas instrucciones permitan generar de forma dinámica una sección del HTML. Los valores que alimentan este proceso comprenden una array de objetos, cuyos datos deberán incluirse empleando métodos del DOM y elementos apropiados para su representación.
 * 
 * @version: 1.7.0
 * @author: Abril Herrada
 * @date: 23/12/2021
 *
 * History:
 *  - v1.0.0: Primera entrega
 *  - v1.1.0: Segunda entrega
 *  - v1.2.0: Tercera entrega
 *  - v1.3.0: Cuarta entrega
 *  - v1.4.0: Quinta entrega
 *  - v1.5.0: Sexta entrega
 *  - v1.6.0: Séptima entrega
 *  - v1.7.0: Octava entrega
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

//Variables globales que se utilizarán en diversas funciones para calcular el total a pagar
let total = 0;
let finalTotal = 0;

//FUNCIONES
//Función que calcula el total a pagar (con descuento) según el total sin descuento y el porcentaje de descuento que se ingrese
const discount = (percentage) => {
    finalTotal = total * ((100 - percentage) / 100);
}
//Función que genera el código HTML de todas las cartas de productos
const productCards = () => {
    let cards = "";
    products.forEach(item => {
        cards = cards +
        `<div class="col mb-5">
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
                    <div class="text-center"><a onclick="addToCart(${item.id})" class="btn btn-outline-dark m-1">Agregar</a></div>
                </div>
            </div>
        </div>`;
    });
    return cards;
}
//Función que agrega los productos al array del carrito
const addToCart = (id) => {
    let quantity = document.getElementById(`productQuantity${id}`).value;
    //Condicional que evalúa si la cantidad es válida y, si lo es, agrega el objeto de producto al array de carrito, si no, le avisa al usuario mediante un alert()
    if (quantity > 0) {
        cart.push({name: products[id - 1].name, price: products[id - 1].price, quantity: quantity});
    }
    else {
        alert("Ingresá una cantidad válida para agregar el producto al carrito.");
    }
    console.log(cart);
    total = total + products[id - 1].price * quantity;
    //Condicional que evalúa si corresponde aplicar el descuento al total a pagar
    if (total >= 10000) {
        discount(25);
    }
    else if (total > 0 && total < 10000) {
        finalTotal = total;
    }
    purchaseSummary();
    let badge = cart.length;
    document.getElementById("badge").innerText = badge;
}
//Función que ordena alfabéticamente los productos agregados al carrito y crea el código HTML del resumen de compra que se imprimirá en el sitio
const purchaseSummary = () => {
    let btns = document.getElementById("modalBtns");
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
        purchase = purchase +
        `<tr>
            <th scope="row">${item.name}</th>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${item.price * item.quantity}</td>
        </tr>`;
    });
    purchase = purchase +
    `<tr class="table-active">
        <th scope="row"></th>
        <td></td>
        <td>Total sin descuento</td>
        <td>${total}</td>
    </tr>
    <tr class="table-active">
        <th scope="row"></th>
        <td></td>
        <td>Descuento (25%)</td>
        <td>${finalTotal - total}</td>
    </tr>
    <tr class="table-active">
        <th scope="row"></th>
        <td></td>
        <td><strong>Total final</strong></td>
        <td>${finalTotal}</td>
    </tr>
    </tbody>
    </table>`;
    document.getElementById("cartSummary").innerHTML = purchase;
}
//Función que vacía el array de carrito
const clearCart = () => {
    cart = [];
    console.log(cart);
    let cleared = 
    `<p>Todavía no agregaste productos a tu carrito.</p>`;
    document.getElementById("cartSummary").innerHTML = cleared;
    let btns = document.getElementById("modalBtns");
    btns.className = "hidden";
    let badge = cart.length;
    document.getElementById("badge").innerText = badge;
}

document.getElementById("productCards").innerHTML = productCards();

let clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", clearCart);
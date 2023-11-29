import { loadCart } from "./cart.js";
import { searchInStorage } from "./localStorage.js";
import { displayItems } from "./items.js";

export function displayButtons(main, nav) {
    fetch('https://fakestoreapi.com/products/categories')
            .then(res=>res.json())
            .then(json=> {
                let categoryBtns = json.map(function(category) {
                    return `<button class="filter" type="button">${category}</button>`
                })
                categoryBtns.push(`<button class="filter" type="button">all</button>`);
                categoryBtns = categoryBtns.join("");            
                nav.innerHTML = categoryBtns;
                nav.innerHTML += `
                    <i class="fa-solid fa-cart-shopping">
                        <label class="quantity"></label>
                    </i>
                    `;
                const cart = document.querySelector(".fa-cart-shopping");
                cart.addEventListener("click", () => loadCart(main))
                searchQuantity();
            })   
            .then (() => {
                const filterBtns = document.querySelectorAll(".filter");
                filterBtns.forEach(function(btn) {
                    btn.addEventListener("click", (e) => {
                        const category = e.currentTarget.innerText.toLowerCase();
                        displayItems(category, main);                     
                    })
                });            
            })
            .catch((error) => {
                console.log(error); 
                let message = error.statusText || "Ocurrió un error";
                main.innerHTML = `Error ${error.status}: ${message}`;
            })     
}

export function searchQuantity() {
    let savedItems = searchInStorage();
    let total = 0;
    
    total = savedItems.reduce((acum, item) => acum + item.quantity, 0);

    let cartNumber = document.querySelector(".quantity");
    cartNumber.innerHTML = total;
}
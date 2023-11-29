import { searchInStorage, saveInStorage, deleteItem } from "./localStorage.js";

export function loadCart(main) {   
    let savedItems = searchInStorage();
    let listLength = savedItems.length;

    main.style.flexDirection = "column";
    main.style.justifyContent = "flex-start";

    if (listLength > 0) {
        let finalPrice = 0;
        let currentItem = 0;    

        main.innerHTML = `
        <div class="total-cart no-display"></div>
        <img class="loader" src="https://www.benmvp.com/f3b3c5fd2893249d60a9cadfc077b96d/loading-spinner-final.svg">
        `;
        location.hash = "cart"; 

        savedItems.forEach(element => {
            let id = element.id;
            let quantity = element.quantity;
            let url = `https://fakestoreapi.com/products/${id}`; 
            let lastItem = listLength;     

            fetch(url)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((json) => {   
                let item = json;    
                main.innerHTML += `
                <article class="item-cart">
                    <img src=${item.image} class="img-cart">
                    <h4 class="title-cart">${item.title}</h4>
                    <p class="price-cart">Price: $ ${item.price}</p>
                    <p class="amount-cart">
                        Amount:
                        <button class="minus" type="button" data-id="${id}" data-price="${item.price}"><i class="fa-solid fa-minus"></i></button>
                        <span data-id="${id}">${quantity}</span>
                        <button class="plus" type="button" data-id="${id}" data-price="${item.price}"><i class="fa-solid fa-plus"></i></button>
                    </p>
                    <button class="delete-item" type="button" data-id="${id}">Delete</button>
                </article>
                `;          
                
                finalPrice += item.price * quantity;
                finalPrice = parseFloat(finalPrice.toFixed(2));
                document.querySelector(".total-cart").innerHTML = `
                Total: $${finalPrice}
                <button class="buy-cart" type="button">Buy Now!</button>
                `;

                currentItem ++;
                
                if(currentItem == lastItem) { 
                    document.querySelector(".total-cart").classList.remove("no-display");                 
                    document.querySelector(".loader").classList.add("no-display");         

                    const deleteBtn = document.querySelectorAll(".delete-item");
                    deleteBtn.forEach((btn) => {
                        btn.addEventListener("click", e => {
                            const id = e.currentTarget.dataset.id;
                            deleteItem(id);            
                        })
                    })

                    const subtractBtn = document.querySelectorAll(".minus");
                    subtractBtn.forEach((btn) => {                     
                            btn.addEventListener("click", function(){subtractAmount(btn.dataset.id, btn.dataset.price), saveInStorage(btn.dataset.id, -1)});         
                        })                   
                    
                    const addBtn = document.querySelectorAll(".plus");
                    addBtn.forEach((btn) => {
                        btn.addEventListener("click", function(){addAmount(btn.dataset.id, btn.dataset.price), saveInStorage(btn.dataset.id, 1)});
                            
                    })
                }
                
            })  
            .catch((err) => {
                let message = err.statusText || "Ocurrió un error";                 
                console.log(`Error ${err.status}: ${message}`);
            })
    
        })         
    } else {
        main.innerHTML = `<p class="empty-cart">Oops! Nothing has been added to the cart yet!</p>`;
    }
}    

function addAmount(id, price) {
    const amount = document.querySelector(`span[data-id="${id}"]`);
    amount.innerText = parseInt(amount.innerText) + 1 ;
    let numbersRegExp = /\d+/g;
    let total = parseFloat(document.querySelector(".total-cart").innerHTML.match(numbersRegExp).join("."));
    
    price = parseFloat(price);
    total = (total + price).toFixed(2);

    document.querySelector(".total-cart").innerHTML = `
    Total: $${total}
    <button class="buy-cart" type="button">Buy Now!</button>
    `;
}
    
function subtractAmount(id, price) {
    const amount = document.querySelector(`span[data-id="${id}"]`);
    amount.innerText = parseInt(amount.innerText) - 1 ;
    
    let numbersRegExp = /\d+/g;    
    let total = parseFloat(document.querySelector(".total-cart").innerHTML.match(numbersRegExp).join("."));
    
    price = parseFloat(price);
    total = (total - price).toFixed(2);

    document.querySelector(".total-cart").innerHTML = `
    Total: $${total}
    <button class="buy-cart" type="button">Buy Now!</button>
    `;
}


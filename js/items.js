import { saveInStorage } from "./localStorage.js";

const body = document.querySelector("body");

export function displayItems(category, main) { 
    let url;
    if (category === "all" || !category) {
        url = `https://fakestoreapi.com/products`;
        location.hash = "all";
    } else {
        url = `https://fakestoreapi.com/products/category/${category}`;
        location.hash = category;
    }
    fetch(url)
            .then(res => res.json())
            .then(json => {              
                const items = json.map(function(item) {
                    const percentage = 100 - (item.rating.rate * 100 / 5);
                    return `
                    <article>
                        <span class="rating">${item.rating.rate}/5 (${item.rating.count})</span>
                        <div class="stars-container">
                            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                            <span class="rating-percentage" style="width:${percentage}%"></span>
                        </div>
                        
                        <img src=${item.image}>
                        <label class="hide">${item.description}</label>
                        <h4 class="item-title">${item.title}</h4>
                        <p>$ ${item.price}</p>
                        <div class="btn-container">
                            <button class="add" type="button" data-id=${item.id}>Add to cart</button>
                            <button class="buy" type="button">Buy Now!</button>
                        </div>
                    </article>
                    `;
                }).join("");
                main.innerHTML = items;
            })
            .then (() => {
                const descriptions = document.querySelectorAll("label");
                descriptions.forEach(function(label) {
                    label.addEventListener("click", (e) => {
                        e.currentTarget.classList.toggle("hide");
                    })
                });

                const addBtns = document.querySelectorAll(".add");
                addBtns.forEach(function(btn) {
                    btn.addEventListener("click", function(){saveInStorage(btn.dataset.id, 1), addedNotification()});
                }); 

                main.style.flexDirection = "row";
                main.style.justifyContent = "center";

            })
            .catch((error) => {
                console.log(error); 
                let message = error.statusText || "Ocurrió un error";
                main.innerHTML = `Error ${error.status}: ${message}`;
            })       
}

function addedNotification() {
    const notification = document.createElement("div");
    notification.classList.add("added-item");
    notification.innerText = "Added to your cart!";
    body.append(notification);
    setTimeout(() => {
        document.querySelector(".added-item").remove();
    }, 2000);
}
import { displayButtons } from "./categories.js";
import { loadCart } from "./cart.js";
import { displayItems } from "./items.js";

const main = document.querySelector("main");
const nav = document.querySelector("nav");
const hamburger = document.querySelector(".hamburger");
const aside = document.querySelector("aside");
const bannerClose = document.querySelector(".banner-close");

window.addEventListener("DOMContentLoaded", (e) => {
    let { hash } = location;

    displayButtons(main, nav);

    if(hash === "#cart") {
        loadCart(main);
    } else {
        hash = hash.slice(1);
        displayItems(hash, main);
    }
});

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("is-active");
    nav.classList.toggle("show");
})

bannerClose.addEventListener("click", () => {
    aside.classList.add("no-display");
})


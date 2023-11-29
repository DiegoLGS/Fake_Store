import { searchQuantity } from "./categories.js";
import { loadCart } from "./cart.js";

export function saveInStorage(id, quantity) {
    let newItem = {id, quantity};
    let savedItems = searchInStorage();
    let indexOfItem = savedItems.findIndex(item => item.id === newItem.id)

    if(indexOfItem != -1) {
        savedItems[indexOfItem].quantity += quantity;

        if(savedItems[indexOfItem].quantity < 1) {    
            return deleteItem(id);     
        }

        localStorage.setItem("list", JSON.stringify(savedItems));
        return searchQuantity();        
    }

    savedItems.push(newItem);                
    localStorage.setItem("list", JSON.stringify(savedItems));
    return searchQuantity(); 
} 

export function searchInStorage() {
    return localStorage.getItem("list") 
    ? JSON.parse(localStorage.getItem("list")) 
    : [];
}

export function deleteItem(id) {
    const main = document.querySelector("main");
    let savedItems = searchInStorage();
    savedItems = savedItems.filter((item) => {
        if(item.id !== id) {
            return item;
        }
    });

    localStorage.setItem("list", JSON.stringify(savedItems));
    searchQuantity(); 
    loadCart(main);
} 
const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");

let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

function editItemToStorage(item, oldItem) {
    console.log(item, oldItem);
    let temp = localStorage.getItem("items");
    temp = JSON.parse(temp);
    temp.splice(temp.indexOf(oldItem), 1, item);
    localStorage.setItem("items", JSON.stringify(temp));
}


function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if(newItem === "") {
        alert("Please add an item");
        return;
    }

    // Check for edit mode
    if(isEditMode && checkIfItemExists(newItem) ) {
        alert("That item already exists!");
        return;
    } else if(isEditMode) {
        
        const itemToEdit = itemList.querySelector(".edit-mode");
        console.log(newItem, itemToEdit.textContent);
        editItemToStorage(newItem, itemToEdit.textContent);
        itemToEdit.textContent = itemInput.value;
        itemToEdit.appendChild(createButton('remove-item btn-link text-red'));
        itemToEdit.classList.remove("edit-mode");
        isEditMode = false;

        checkUI();
        itemInput.value = "";
    } else if(checkIfItemExists(newItem)) {
        alert("That item already exists!");
        return;
    } else {
        // Create item DOM element
        addItemToDOM(newItem);

        // Add item to local storage
        addItemToStorage(newItem);

        checkUI();

        itemInput.value = "";
    }
}

function addItemToDOM(item) {
    // Create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to DOM
    itemList.appendChild(li);
}

function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const i = document.createElement("i");
    i.className = classes;
    return i;
}


function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;
    if(localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }    

    return itemsFromStorage;
}

function onClickItem(e) {
    if(e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else if(e.target.nodeName === "LI" && e.target.classList.contains("edit-mode")) {
        e.target.classList.remove("edit-mode");  
        formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
        formBtn.style.backgroundColor = "#333";
        itemInput.value = "";      
    } else if(e.target.nodeName === "LI") {
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll("li").forEach(i => i.classList.remove("edit-mode"));
    item.classList.add("edit-mode");
    formBtn.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
    itemInput.value = item.textContent;
    formBtn.style.backgroundColor = "#228b22";
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
    
}

function removeItem(item) {
    if(confirm("Are you sure?")) {
        // Remove item from DOM
        item.remove();

        // Remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter(i => i !== item);
    console.log(itemsFromStorage);

    // Reset to localstorage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));

}

function clearItems(e) {
    
    if(confirm("Are you sure?")) {
        while(itemList.childNodes[0]) {
            itemList.childNodes[0].remove();
        }       

        // Clear from localStorage
        localStorage.removeItem("items");
        checkUI();
    }
}

function filterItems(e) {
    const items = itemList.querySelectorAll("li");
    const text = e.target.value.toLowerCase();
    items.forEach(item => {
        const itemName = item.innerText.toLowerCase();
        
        if(itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    })

    console.log(text);
}

function checkUI() {
    itemInput.value = "";
    const items = itemList.querySelectorAll("li");
    if(items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }

    formBtn.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
    formBtn.style.backgroundColor = "#333";


    isEditMode = false;
}

// Initialize app
function init() {
    // Event Listeners
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    clearBtn.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    checkUI();
}


init();





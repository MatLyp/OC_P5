const apiUrl = "http://localhost:3000/api/products/";

function getData(...funct) {

    fetch(apiUrl)
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            //commentaires!!
            for(let i=0; i<funct.length; i++){
                funct[i](value);
            }

            let deleteItem = document.getElementsByClassName("deleteItem");
            for (let i=0; i<deleteItem.length; i++) {
                deleteItem[i].addEventListener("click", deleteCartElems);
            }
        
            let itemQty = document.getElementsByClassName("itemQuantity");
            for (let i=0; i<itemQty.length; i++) {
                itemQty[i].addEventListener("change", changeQuantity);
            }

        })
        .catch (function(err) {
            // Une erreur s'est produite
            console.log(err);
        })
}

function createCartElems(cartProduct) {

    let storedCart = getCart();

    storedCart.forEach(element => {

        let index = cartProduct.findIndex( e => e._id === element.id);

        const createCartArticle = document.createElement("article");
        createCartArticle.className = "cart__item"
        createCartArticle.setAttribute("data-id", element.id);
        createCartArticle.setAttribute("data-color", element.color);
        document.getElementById("cart__items").appendChild(createCartArticle);
    
        const createCartDivImg = document.createElement("div");
        createCartDivImg.className = "cart__item__img";
    
        createCartArticle.appendChild(createCartDivImg);
    
        const createCartImg = document.createElement("img");
        createCartImg.setAttribute("src", `${cartProduct[index].imageUrl}`);
        createCartImg.setAttribute("alt", `${cartProduct[index].altTxt}`);

        createCartDivImg.appendChild(createCartImg);

        const createCartDivContent = document.createElement("div");
        createCartDivContent.className = "cart__item__content";        

        createCartArticle.appendChild(createCartDivContent);

        const createCartDivContentDescription = document.createElement("div");
        createCartDivContentDescription.className = "cart__item__content__description";

        createCartDivContent.appendChild(createCartDivContentDescription);

        const createCartContentTitle = document.createElement("h2");
        createCartContentTitle.innerText = `${cartProduct[index].name}`;
        const createCartContentColor = document.createElement("p");
        createCartContentColor.innerText = element.color;
        const createCartContentPrice = document.createElement("p");
        createCartContentPrice.innerText = `${cartProduct[index].price}` + " €";

        createCartDivContentDescription.append(createCartContentTitle, createCartContentColor, createCartContentPrice);

        const createCartDivContentSettings = document.createElement("div");
        createCartDivContentSettings.className = "cart__item__content__settings";

        createCartDivContent.appendChild(createCartDivContentSettings);

        const createCartContentSettingsQty = document.createElement("div");
        createCartContentSettingsQty.className = "cart__item__content__settings__quantity";

        createCartDivContentSettings.appendChild(createCartContentSettingsQty);

        const createCartContentQty = document.createElement("p");
        createCartContentQty.innerText = "Qté : ";
        const createCartInputQty = document.createElement("input");
        createCartInputQty.setAttribute("type", "number");
        createCartInputQty.setAttribute("class", "itemQuantity");
        createCartInputQty.setAttribute("name", "itemQuantity");
        createCartInputQty.setAttribute("min", "1");
        createCartInputQty.setAttribute("max", "100");
        createCartInputQty.setAttribute("value", element.quantity);

        createCartContentSettingsQty.append(createCartContentQty, createCartInputQty);

        const createCartDivContentSettingsDelete = document.createElement("div");
        createCartDivContentSettingsDelete.className = "cart__item__content__settings__delete";

        createCartDivContentSettings.appendChild(createCartDivContentSettingsDelete);

        const createCartDeleteButton = document.createElement("p");
        createCartDeleteButton.className = "deleteItem";
        createCartDeleteButton.innerText = "Supprimer";

        createCartDivContentSettingsDelete.appendChild(createCartDeleteButton);
      
    })

}

function getCart(){

    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}


function saveCart(cart) {

    localStorage.setItem("cart", JSON.stringify(cart));
}


function changeQuantity(event) {

    let cart = getCart();
    let newQuantity = event.target.value;
    let articleHtmlElem = event.target.closest('article');
    const indexInCart = cart.findIndex((element) => element.id === articleHtmlElem.dataset.id && element.color === articleHtmlElem.dataset.color);
    cart[indexInCart].quantity = newQuantity;
    saveCart(cart);

    displayTotalCartQuantity();
    displayTotalCartPrice();
}


function displayTotalCartQuantity() {

    let totalQuantity = 0;
    let storedCart = getCart();

    storedCart.forEach(element => {
        totalQuantity += parseInt(element.quantity);
    });
    document.getElementById("totalQuantity").innerText = totalQuantity;
}


// function displayTotalCartPrice(cartProduct) {

//     let totalPrice = 0;
//     let storedCart = getCart();

//     storedCart.forEach(element => {
//         let index = cartProduct.findIndex( e => e._id === element.id);
//         totalPrice += parseInt(`${cartProduct[index].price}`) * element.quantity;
//     });

//     document.getElementById("totalPrice").innerText = totalPrice;
// }

function displayTotalCartPrice() {  // test no api call function version

    let storedCart = getCart();
    let elemQuantity = [];
    let totalPrice = 0;

    storedCart.forEach(element => {
        elemQuantity.push(element.quantity);
    })

    let priceHtmlElems = document.getElementsByClassName("cart__item__content__description")

    for(let i=0; i<priceHtmlElems.length; i++) {
        totalPrice += parseInt(priceHtmlElems[i].lastChild.innerText.replace(" €", "")) * elemQuantity[i];
        console.log(totalPrice);
        // console.log(priceHtmlElems[i].lastChild.innerText.replace(" €", ""));
    }

    document.getElementById("totalPrice").innerText = totalPrice;
}


function deleteCartElems(event) {

    let cart = getCart();
    let articleHtmlElem = event.target.closest('article');

    const indexInCart = cart.findIndex((element) => element.id === articleHtmlElem.dataset.id && element.color === articleHtmlElem.dataset.color);

    cart.splice(indexInCart, 1);
    saveCart(cart);

    while (articleHtmlElem.lastElementChild){
        articleHtmlElem.removeChild(articleHtmlElem.lastElementChild);
    }
    articleHtmlElem.remove();

    displayTotalCartQuantity();
    displayTotalCartPrice();
}

function formValidation() {

    const NameRegex = /^(?=.{1,50}$)[a-z]+(?:[-\s][a-z]+)*$/i;
    // ^                 - start of string
    // (?=.{1,50}$)      - there must be 1 to 50 chars in the string
    // [a-z]+            - 1 or more ASCII letters
    // (?:[-\s][a-z]+)*  - 0 or more sequences of - or whitespace and 1 or more ASCII letters
    // $                 - end of string
    // /i                - a case insensitive modifier
    let firstNameField = document.getElementById("firstName");
    firstNameField.value = "";
    firstNameField.addEventListener("input", (e) => { 
        let firstName = e.target.value;
        if(NameRegex.test(firstName)){
            document.getElementById("firstNameErrorMsg").innerText = "";
            firstNameField.setCustomValidity("");
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "Please enter a valid name (only letters and - or space are accepted).\nEx: Marie-Agathe";
            firstNameField.setCustomValidity("Veuillez saisir un prenom valide");
        }
    });

    let lastNameField = document.getElementById("lastName");
    lastNameField.value = "";
    lastNameField.addEventListener("input", (e) => { 
        let lastName = e.target.value;
        if(NameRegex.test(lastName)){
            document.getElementById("lastNameErrorMsg").innerText = "";
            lastNameField.setCustomValidity("");
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "Please enter a valid name (only letters and - or space are accepted).\nEx: Du Pont";
            lastNameField.setCustomValidity("Veuillez saisir un nom valide");
        }
    });

    const addressRegex = /^(?=.{1,100}$)[a-z0-9]+(?:([-.,\s]|[,][\s]|[.][\s])[a-z0-9]+)*$/i;
    // ^                                        - start of string
    // (?=.{1,100}$)                            - there must be 1 to 100 chars in the string
    // [a-z0-9]+                                - 1 or more ASCII letters or number
    // (?:([-.,\s]|[,][\s]|[.][\s])[a-z0-9]+)*  - 0 or more sequences of ((- . , or whitespace) or (. followed by whitespace) or (, followed by whitespace) and 1 or more ASCII letter or number)
    // $                                        - end of string
    // /i                                       - a case insensitive modifier
    let addressField = document.getElementById("address");
    addressField.value = "";
    addressField.addEventListener("input", (e) => { 
        let address = e.target.value;
        if(addressRegex.test(address)){
            document.getElementById("addressErrorMsg").innerText = "";
            addressField.setCustomValidity("");
        } else {
            document.getElementById("addressErrorMsg").innerText = "Please enter a valid address (only letters, numbers and space - , or . are accepted).\nEx: 15 bis avenue du G.Leclerc, apt 12-C";
            addressField.setCustomValidity("Veuillez saisir une addresse valide");
        }
    });

    const cityRegex = /^(?=.{1,50}$)[a-z]+(?:[-\s][a-z]+)*$/i;
    //same expression as nameRegex
    let cityField = document.getElementById("city");
    cityField.value = "";
    cityField.addEventListener("input", (e) => { 
        let city = e.target.value;
        if(cityRegex.test(city)){
            document.getElementById("cityErrorMsg").innerText = "";
            cityField.setCustomValidity("");
        } else {
            document.getElementById("cityErrorMsg").innerText = "Please enter a valid city name (only letters and - or space are accepted).\nEx: Nogent-sur-Seine";
            cityField.setCustomValidity("Veuillez saisir un nom de ville valide");
        }
    });

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    let emailField = document.getElementById("email");
    emailField.value = "";
    emailField.addEventListener("input", (e) => { 
        let email = e.target.value;
        if(emailRegex.test(email)){
            document.getElementById("emailErrorMsg").innerText = "";
            emailField.setCustomValidity("");
            // console.log(email);
            // console.log(email.value);
        } else {
            document.getElementById("emailErrorMsg").innerText = "Please enter a valid email (only letters and - or space are accepted).\nEx: Jean-truc@heberg.com";
            emailField.setCustomValidity("Veuillez saisir une addresse électronique valide");
        }
    });

    let cartForm = document.querySelector(".cart__order__form");
    cartForm.addEventListener("submit", sendForm);

}

function sendForm(event) {
    event.preventDefault();
    console.log("ok");

    const contact = {
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value
    }

    let cart = getCart();
    let products = [];
    for(let product in cart) {
        products.push(cart[product].id);
    }

    fetch(apiUrl + 'order', {
        method: "POST",
        headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({contact, products})
    })
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        // console.log(value.orderId);
        window.location.href = 'confirmation.html?orderId=' + value.orderId;
    })
    .catch (function(err) {
        // Une erreur s'est produite
        console.log(err);
    })
}



getData(createCartElems, displayTotalCartQuantity, displayTotalCartPrice);
formValidation();
const apiUrl = "http://localhost:3000/api/products/";   //lien vers l'api

//function de récuperation des données de l'api (GET method)
function getData() {
    fetch(apiUrl)
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            //Pour chaque produit ajouté au panier, appel de la fonction createCartElems grâce aux données recuperées via l'api
            createCartElems(value);

        })
        .catch (function(err) {
            // en cas d'erreur l'affiche dans la console
            console.log(err);
        })
}

//creation des elements html et leurs attributs pour chaque produit du panier
//prend en argument les données de l'api
function createCartElems(cartProduct) {

    let storedCart = getCart();

    storedCart.forEach(element => {
        // trouve l'index du produit dans l'api correspondant au produit stocké dans le panier
        let index = cartProduct.findIndex( e => e._id === element.id);
        // <article>
        const createCartArticle = document.createElement("article");
        createCartArticle.className = "cart__item"
        createCartArticle.setAttribute("data-id", element.id);
        createCartArticle.setAttribute("data-color", element.color);
        document.getElementById("cart__items").appendChild(createCartArticle);
        // <div>
        const createCartDivImg = document.createElement("div");
        createCartDivImg.className = "cart__item__img";
        // <img>
        const createCartImg = document.createElement("img");
        createCartImg.setAttribute("src", `${cartProduct[index].imageUrl}`);
        createCartImg.setAttribute("alt", `${cartProduct[index].altTxt}`);
        // ajout des elements (article > div > image)
        createCartArticle.appendChild(createCartDivImg);
        createCartDivImg.appendChild(createCartImg);
        // <div>
        const createCartDivContent = document.createElement("div");
        createCartDivContent.className = "cart__item__content";        
        // <div>
        const createCartDivContentDescription = document.createElement("div");
        createCartDivContentDescription.className = "cart__item__content__description";
        // <h2>
        const createCartContentTitle = document.createElement("h2");
        createCartContentTitle.innerText = `${cartProduct[index].name}`;
        // <p>
        const createCartContentColor = document.createElement("p");
        createCartContentColor.innerText = element.color;
        // <p>
        const createCartContentPrice = document.createElement("p");
        createCartContentPrice.innerText = `${cartProduct[index].price}` + " €";
        // ajout des elements (article > div > div > h2, p, p)
        createCartArticle.appendChild(createCartDivContent);
        createCartDivContent.appendChild(createCartDivContentDescription);
        createCartDivContentDescription.append(createCartContentTitle, createCartContentColor, createCartContentPrice);
        // <div>
        const createCartDivContentSettings = document.createElement("div");
        createCartDivContentSettings.className = "cart__item__content__settings";        
        // <div>
        const createCartContentSettingsQty = document.createElement("div");
        createCartContentSettingsQty.className = "cart__item__content__settings__quantity";
        // <p>
        const createCartContentQty = document.createElement("p");
        createCartContentQty.innerText = "Qté : ";
        // <input>
        const createCartInputQty = document.createElement("input");
        createCartInputQty.setAttribute("type", "number");
        createCartInputQty.setAttribute("class", "itemQuantity");
        createCartInputQty.setAttribute("name", "itemQuantity");
        createCartInputQty.setAttribute("min", "1");
        createCartInputQty.setAttribute("max", "100");
        createCartInputQty.setAttribute("value", element.quantity);
        // ajout des elements (article > div > div > div > p, input)
        createCartDivContent.appendChild(createCartDivContentSettings);
        createCartDivContentSettings.appendChild(createCartContentSettingsQty);
        createCartContentSettingsQty.append(createCartContentQty, createCartInputQty);
        // <div>
        const createCartDivContentSettingsDelete = document.createElement("div");
        createCartDivContentSettingsDelete.className = "cart__item__content__settings__delete";
        const createCartDeleteButton = document.createElement("p");
        createCartDeleteButton.className = "deleteItem";
        createCartDeleteButton.innerText = "Supprimer";
        // ajout des elements (article > div > div > div > p)
        createCartDivContentSettings.appendChild(createCartDivContentSettingsDelete);
        createCartDivContentSettingsDelete.appendChild(createCartDeleteButton);
      
    })

    // appel la fonction changeQuantity à chaque changement de valeur des inputs de quantité des elements du panier
    let itemQty = document.getElementsByClassName("itemQuantity");
    for (let i=0; i<itemQty.length; i++) {
        itemQty[i].addEventListener("change", changeQuantity);
    }

    // appel la fonction deleteCartElems à chaque clic sur le bouton de suppression d'un element du panier
    let deleteItem = document.getElementsByClassName("deleteItem");
    for (let i=0; i<deleteItem.length; i++) {
        deleteItem[i].addEventListener("click", deleteCartElems);
    }

    displayTotalCartQuantity();
    displayTotalCartPrice();
}

//recuperation et parsing du panier stocké dans le localStorage ou renvoi d'un tableau vide si aucun panier
function getCart(){
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

//enregistrement des modification du panier dans le localStorage au format JSON
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// fonction de calcul et d'affichage du nombre total de produit dans le panier
function displayTotalCartQuantity() {

    let totalQuantity = 0;
    let storedCart = getCart();

    storedCart.forEach(element => {
        totalQuantity += parseInt(element.quantity);
    });
    document.getElementById("totalQuantity").innerText = totalQuantity;
}

// fonction de calcul et d'affichage du coût total des produits dans le panier
// la fonction recupère le prix du produit dans la description de celui-ci pour ne pas faire appel à l'api à chaque modif du panier et le multiplie par sa quantité pour chaque produit ajouté au panier
function displayTotalCartPrice() {

    let storedCart = getCart();
    let elemQuantity = [];
    let totalPrice = 0;

    storedCart.forEach(element => {
        elemQuantity.push(element.quantity);
    })

    let priceHtmlElems = document.getElementsByClassName("cart__item__content__description")

    for (let i=0; i<priceHtmlElems.length; i++) {
        totalPrice += parseInt(priceHtmlElems[i].lastChild.innerText.replace(" €", "")) * elemQuantity[i];
    }

    document.getElementById("totalPrice").innerText = totalPrice;
}

// fonction de modification de la quantité pour chaque produit
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

// fonction de suppression d'un produit du panier
function deleteCartElems(event) {

    let cart = getCart();
    let articleHtmlElem = event.target.closest('article');

    const indexInCart = cart.findIndex((element) => element.id === articleHtmlElem.dataset.id && element.color === articleHtmlElem.dataset.color);
    // suppression du produit dans le panier
    cart.splice(indexInCart, 1);
    saveCart(cart);
    // suppression des elements du dom
    while (articleHtmlElem.lastElementChild){
        articleHtmlElem.removeChild(articleHtmlElem.lastElementChild);
    }
    articleHtmlElem.remove();

    displayTotalCartQuantity();
    displayTotalCartPrice();
}

// fonction de verification des champs du formulaire avant envoi
function formValidation() {

    const NameRegex = /^(?=.{1,50}$)[a-z]+(?:[-\s][a-z]+)*$/i;
    // ^                 - start of string
    // (?=.{1,50}$)      - there must be 1 to 50 chars in the string
    // [a-z]             - 1 or more ASCII letters
    // (?:[-\s][a-z]+)*  - 0 or more sequences of - or whitespace and 1 or more ASCII letters
    // $                 - end of string
    // /i                - a case insensitive modifier
    let firstNameField = document.getElementById("firstName");
    firstNameField.value = "";
    firstNameField.addEventListener("input", (e) => { 
        let firstName = e.target.value;
        if (NameRegex.test(firstName)) {
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
        if (NameRegex.test(lastName)) {
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
    // [a-z0-9]                                 - 1 or more ASCII letters or number
    // (?:([-.,\s]|[,][\s]|[.][\s])[a-z0-9]+)*  - 0 or more sequences of ((- . , or whitespace) or (. followed by whitespace) or (, followed by whitespace) and 1 or more ASCII letter or number)
    // $                                        - end of string
    // /i                                       - a case insensitive modifier
    let addressField = document.getElementById("address");
    addressField.value = "";
    addressField.addEventListener("input", (e) => { 
        let address = e.target.value;
        if (addressRegex.test(address)) {
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
        if (cityRegex.test(city)) {
            document.getElementById("cityErrorMsg").innerText = "";
            cityField.setCustomValidity("");
        } else {
            document.getElementById("cityErrorMsg").innerText = "Please enter a valid city name (only letters and - or space are accepted).\nEx: Nogent-sur-Seine";
            cityField.setCustomValidity("Veuillez saisir un nom de ville valide");
        }
    });

    const emailRegex = /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i;
    // ^             - start of string
    // [a-z0-9_.+-]  - 1 or more ASCII letters, number or underscore, dot, plus or hyphen
    // @             - At sign required
    // [a-z0-9-]     - 1 or more ASCII letters, number or hyphen
    // \.            - dot required
    // [a-z0-9-.]    - 1 or more ASCII letters, number hyphen or dot
    // $             - end of string
    // /i            - a case insensitive modifier
    let emailField = document.getElementById("email");
    emailField.value = "";
    emailField.addEventListener("input", (e) => { 
        let email = e.target.value;
        if (emailRegex.test(email)) {
            document.getElementById("emailErrorMsg").innerText = "";
            emailField.setCustomValidity("");
        } else {
            document.getElementById("emailErrorMsg").innerText = "Please enter a valid email (only letters and - or space are accepted).\nEx: Jean-truc@heberg.com";
            emailField.setCustomValidity("Veuillez saisir une addresse électronique valide");
        }
    });

    let cartForm = document.querySelector(".cart__order__form");
    cartForm.addEventListener("submit", sendForm);
}

// fonction qui créer l'objet contact grâce aux données saisies dans le formulaire
// et le renvoi à l'api avec les produits du panier puis redirige vers la page de confirmation
function sendForm(event) {

    event.preventDefault();

    const contact = {
        firstName : firstName.value,
        lastName : lastName.value,
        address : address.value,
        city : city.value,
        email : email.value
    }

    let cart = getCart();

    // renvoi vers la page confirmation que si le panier n'est pas vide
    if(cart.length == 0) {
        alert("Votre panier est vide.");
    } else {

        let products = [];
        for(let product in cart) {
            products.push(cart[product].id);
        }
        
        // envoi de la commande à l'api (POST)
        fetch(apiUrl + 'order', {
            method: "POST",
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            // ajout de l'objet contact et du panier
            body: JSON.stringify({contact, products})
        })
        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(value) {
            // clear du localStorage et redirection
            localStorage.clear();
            window.location.href = 'confirmation.html?orderId=' + value.orderId;
        })
        .catch (function(err) {
            // Une erreur s'est produite
            console.log(err);
        })
    }
}

getData();
formValidation();

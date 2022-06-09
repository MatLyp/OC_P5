const apiUrl = "http://localhost:3000/api/products/";


function getData() {
    fetch(apiUrl)
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            //commentaires!!
            createCartElems(value);
        })
        .catch (function(err) {
            // Une erreur s'est produite
            console.log(err);
        })
}


function createCartElems(cartProduct) {

    let storedCart = JSON.parse(localStorage.getItem("cart"));
    console.log(storedCart);

    // let cart = [];
    // cart.push(JSON.parse(localStorage.getItem("cart")));
    // console.log(cart);


    storedCart.forEach( element => {

        let index = cartProduct.findIndex( e => e._id === element.id);
        console.log(index);
        console.log(cartProduct[index]._id);

        const createCartArticle = document.createElement("article");
        createCartArticle.className = "cart__item"
        createCartArticle.setAttribute("data-id", element.id);
        createCartArticle.setAttribute("data-color", element.clr);
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
        createCartContentColor.innerText = element.clr;
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
        createCartInputQty.setAttribute("value", element.qty);

        createCartContentSettingsQty.append(createCartContentQty, createCartInputQty);

        const createCartDivContentSettingsDelete = document.createElement("div");
        createCartDivContentSettingsDelete.className = "cart__item__content__settings__delete";

        createCartDivContentSettings.appendChild(createCartDivContentSettingsDelete);

        const createCartDeleteButton = document.createElement("p");
        createCartDeleteButton.className = "deleteItem";
        createCartDeleteButton.innerText = "Supprimer";

        createCartDivContentSettingsDelete.appendChild(createCartDeleteButton);

        // console.log(`${cartProduct[index].imageUrl}`);
        // console.log(`${cartProduct[index].altTxt}`);
    })


}

getData();



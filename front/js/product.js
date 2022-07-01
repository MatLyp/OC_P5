const apiUrl = "http://localhost:3000/api/products/";   //lien vers l'api

// fonction de recuperation de l'ID du produit transmis à l'url
function getProductId() {
    let pageUrl = window.location.href;
    let url = new URL(pageUrl);
    let productId = url.searchParams.get("id");
    return productId;
}

// récuperation des données de l'api pour un seul produit selectionné grâce à son id (GET method)
function getProduct() {
    fetch(apiUrl + getProductId())
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            // création de la page produit
            createProductElems(value);
            // détection du click sur bouton "ajouter au panier" et appel de la fonction correspondante
            document.getElementById("addToCart").addEventListener("click", () => {
                addToCart(value);
            });
        })
        .catch (function(err) {
            // en cas d'erreur l'affiche dans la console
            console.log(err);
        })
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


// fonction qui ajoute le produit au panier (couleur/quantité) en stockant les information dans le localStorage.
function addToCart(productDatas){

    let quantitySelect = document.getElementById("quantity").value;
    let colorSelect = document.getElementById("colors").value;

    //Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans le tableau    
    if (quantitySelect <= 0 || colorSelect == ""){
        alert("Veuillez choisir une couleur et saisir la quantité pour ajouter au panier");
    } else {
        let cart = getCart();

        // .findIndex() renvoi -1 si aucun element correspondant aux valeurs n'a été trouvé (id et couleur)
        // s'il trouve un element, on incremente la quantité actuelle de l'element par la quantité choisie
        // sinon, on créé un nouvel objet que l'on ajoute au tableau cart(le panier).
        const indexInCart = cart.findIndex((element) => element.id === `${productDatas._id}` && element.color === colorSelect);
        if (indexInCart !== -1) {
            let productQuantity = parseInt(cart[indexInCart].quantity);
            productQuantity += parseInt(quantitySelect);
            cart[indexInCart].quantity = productQuantity.toString();
            alert("Ajout de " + quantitySelect + " quantité");
        } else {
            let objAddProduct = {
                id: `${productDatas._id}`,
                quantity: quantitySelect,
                color: colorSelect
            }
            cart.push(objAddProduct);
            alert("Ajouté au panier");
        }

        saveCart(cart);
    }
}

// fonction de création de la page produit en fonction du produit séléctionné
function createProductElems(productInfo) {

    //insertion dans le titre du nom du produit
    document.querySelector("title").textContent = `${productInfo.name}`;

    //<img> du produit et ajout au DOM
    const createProductImg = document.createElement("img");
    createProductImg.setAttribute("src", `${productInfo.imageUrl}`);
    createProductImg.setAttribute("alt", `${productInfo.altTxt}`);
    document.querySelector("main div section article div").appendChild(createProductImg);

    //insertion des infos du produit (nom, prix et description)
    document.getElementById("title").textContent = `${productInfo.name}`;
    document.getElementById("price").textContent = `${productInfo.price}`;
    document.getElementById("description").textContent = `${productInfo.description}`;

    //Pour chaque couleur disponible pour un même produit, création et ajout au DOM des options de selection de chaque couleur
    for (let i in productInfo.colors) {
        const createProductColorsOptions = document.createElement("option");
        createProductColorsOptions.setAttribute("value", `${productInfo.colors[i]}`);
        createProductColorsOptions.textContent = `${productInfo.colors[i]}`;
        document.getElementById("colors").appendChild(createProductColorsOptions);
    }
}

getProduct();

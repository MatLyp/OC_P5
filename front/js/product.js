const apiUrl = "http://localhost:3000/api/products/";

//Pour obtenir l'ID du produit transmis à l'url
function getProductId() {
    let pageUrl = window.location.href;
    let url = new URL(pageUrl);
    let productId = url.searchParams.get("id");
    return productId;
}

function getProduct() {
    fetch(apiUrl + getProductId())
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            //création de la page produit
            createProductElems(value);
            //détection du click sur bouton "ajouter au panier"
            document.getElementById("addToCart").addEventListener("click", () => {
                //appel de la fonction qui ajoute le produit au panier (couleur/quantité) en stockant les information dans le localStorage.
                addToCart(value);
            });
        })
        .catch (function(err) {
            // Une erreur s'est produite
            console.log(err);
        })
}

function addToCart(productDatas){
    let quantity = document.getElementById("quantity").value;
    let colorSelect = document.getElementById("colors").value;

    let cart = [];

    // let count = 0;
    // let isInCart = false;

    if (quantity <= 0 || colorSelect == ""){
        alert("Veuillez choisir une couleur et saisir la quantité pour ajouter au panier");
    } else {

        if (localStorage.getItem("cart") != null ) {
            cart = (JSON.parse(localStorage.getItem("cart")));
            // console.log(cart);
        }

        //Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array
        // !!! Utiliser methode array.find ou array.findIndex !!!
        // for (let product of cart){
        //     if (product.id === getProductId() && product.clr === colorSelect) {
        //         console.log(count);
        //         console.log(cart[count].qty);

        //         let nbrThisProduct = parseInt(cart[count].qty);
        //         nbrThisProduct += parseInt(quantity);
        //         // console.log(typeof quantity);
        //         cart[count].qty = toString(nbrThisProduct);
        //         quantity = toString(quantity);
        //         // console.log(typeof cart[count].qty);
        //         isInCart = true;
        //         break;
        //     }
        //     count ++;
        // }

        // if (isInCart == false) {

            let objAddProduct = {
                id: `${productDatas._id}`,
                qty: quantity,
                clr: colorSelect
            }
    
            cart.push(objAddProduct);
            localStorage.setItem("cart", JSON.stringify(cart));

        // }


        // for(i=0; i<cart.length; i++) {
        //     console.log(cart[i].qty);
        // };

        alert("Ajouté au panier");
    }
}

function createProductElems(productInfo) {

    document.querySelector("title").textContent = `${productInfo.name}`;

    const createProductImg = document.createElement("img");
    createProductImg.setAttribute("src", `${productInfo.imageUrl}`);
    createProductImg.setAttribute("alt", `${productInfo.altTxt}`);

    document.querySelector("main div section article div").appendChild(createProductImg);

    document.getElementById("title").textContent = `${productInfo.name}`;
    document.getElementById("price").textContent = `${productInfo.price}`;
    document.getElementById("description").textContent = `${productInfo.description}`;

    for (let i in productInfo.colors) {
        const createProductColorsOptions = document.createElement("option");
        createProductColorsOptions.setAttribute("value", `${productInfo.colors[i]}`);
        createProductColorsOptions.textContent = `${productInfo.colors[i]}`;
        document.getElementById("colors").appendChild(createProductColorsOptions);
    }
}

getProduct();

// console.log(getProductId());
// console.log(apiUrl + getProductId());
//  console.log(JSON.parse(localStorage.getItem("panier")).id);
const apiUrl = "http://localhost:3000/api/products/";

function getProductId() {
    let pageUrl = window.location.href;
    let url = new URL(pageUrl);
    let productId = url.searchParams.get("id");
    // console.log(productId)
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
            createProductElems(value);
            document.getElementById("addToCart").addEventListener("click", () => {
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

    if (quantity <= 0 || colorSelect == ""){
        alert("Veuillez choisir une couleur et saisir la quantité pour ajouter au panier");
    }
    else {
        // if() Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array
        let objAddProduct = {
            id: `${productDatas._id}`,
            qte: quantity,
            clr: colorSelect
        }

        cart.push(JSON.stringify(objAddProduct));
        localStorage.setItem("obj", cart);
        console.log(cart[0]);
        // localStorage.setItem("obj", JSON.stringify(objAddProduct));
        // console.log(JSON.parse(localStorage.getItem("obj")));

        alert("Ajouté au panier");
    }
    console.log(quantity);
    console.log(colorSelect);
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

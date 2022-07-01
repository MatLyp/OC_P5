const apiUrl = "http://localhost:3000/api/products/";   //lien vers l'api

//creation des elements html et leurs attributs pour chaque produit de l'api
//prend en argument les données de l'api
function createHomeCards(product) {
    //<a> (pour chaque produit, le lien renvoi vers la page produit correspondant grâce à l'id du produit transmis à l'url)
    const newProductLink = document.createElement("a");
    newProductLink.setAttribute("href", `./product.html?id=${product._id}`);
    //<article>
    const newProductArticle = document.createElement("article");
    //<img>
    const newProductImg = document.createElement("img");
    newProductImg.setAttribute("src", `${product.imageUrl}`);
    newProductImg.setAttribute("alt", `${product.altTxt}`);
    //<h3>
    const newProductTitle = document.createElement("h3");
    newProductTitle.setAttribute("class", "productName");
    newProductTitle.innerText = `${product.name}`;
    //<p>
    const newProductParagraph = document.createElement("p");
    newProductParagraph.setAttribute("class", "productDescription");
    newProductParagraph.innerText = `${product.description}`;
    //ajout des elements au bloc <section .item> (a > article > img, h3, p)
    document.getElementById("items").appendChild(newProductLink);
    newProductLink.appendChild(newProductArticle);
    newProductArticle.append(newProductImg, newProductTitle, newProductParagraph);
}

//function de récuperation des données de l'api (GET method)
function getData() {
    fetch(apiUrl)
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            //Pour chaque produit disponible dans l'api, appel de la fonction createHomeCards avec les données de l'api en paramètre
            for (let elem of value) {
                createHomeCards(elem);
            }
        })
        .catch (function(err) {
            // en cas d'erreur l'affiche dans la console
            console.log(err);
        })
}

// async function getData() {       // Une autre manière de request l'api
//     const response = await fetch(apiUrl);
//     const value = await response.json();
//     for (let elem of value) {
//         createHomeCard(elem);
//     }
// }

getData();

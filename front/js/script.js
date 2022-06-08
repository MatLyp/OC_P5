const apiUrl = "http://localhost:3000/api/products/";

//commentaires !!
function createHomeCards(product) {

    const newProductLink = document.createElement("a");
    newProductLink.setAttribute("href", `./product.html?id=${product._id}`);

    const newProductArticle = document.createElement("article");
    
    const newProductImg = document.createElement("img");
    newProductImg.setAttribute("src", `${product.imageUrl}`);
    newProductImg.setAttribute("alt", `${product.altTxt}`);

    const newProductTitle = document.createElement("h3");
    newProductTitle.setAttribute("class", "productName");
    newProductTitle.innerText = `${product.name}`;
    
    const newProductParagraph = document.createElement("p");
    newProductParagraph.setAttribute("class", "productDescription");
    newProductParagraph.innerText = `${product.description}`;

    document.getElementById("items").appendChild(newProductLink);
    newProductLink.appendChild(newProductArticle);
    newProductArticle.append(newProductImg, newProductTitle, newProductParagraph);
}

//commentaires !!
function getData() {
    fetch(apiUrl)
        .then (function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then (function(value) {
            //commentaires!!
            for (let elem of value) {
                createHomeCards(elem);
            }
        })
        .catch (function(err) {
            // Une erreur s'est produite
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



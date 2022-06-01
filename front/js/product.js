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
            console.log(value)
        })
        .catch (function(err) {
            // Une erreur s'est produite
            // console.log(err);
        })
}

getProduct();
// console.log(getProductId());
// console.log(apiUrl + getProductId());
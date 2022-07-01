// récuperation du numéro de commande transmise à l'url via l'api et affichage sur la page
function getOrderId() {
    let pageUrl = window.location.href;
    let url = new URL(pageUrl);
    let orderId = url.searchParams.get("orderId");
    document.getElementById("orderId").innerText = orderId;
}

getOrderId();

function generarCodigoQR(url) {
    //let nombre = document.getElementById("nombre").value;
    console.log("QUÉ PASA POR PARÁMETRO????" + url);
    if(url){
        let contenedorQr = document.getElementById("codigoQr");
        contenedorQr.innerHTML = "";
        new QRCode(contenedorQr, url);

        document.getElementById("contenedorQr").style.display = "block";
        
    }else {
        alert("Por favor, ingresa una URL válida");
    }
}

function pasarAGenerar(){
    let url = "https://arte.ovh/";
    generarCodigoQR(url);
}

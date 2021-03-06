var getHttpRequest = function () {
    var httpRequest = false;

    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
        if (httpRequest.overrideMimeType) {
            httpRequest.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) {
        try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
        }
    }
    if (!httpRequest) {
        alert("Abandon :( Impossible de créer une instance XMLHTTP");
        return false;
    }
    return httpRequest;
}

var result = document.querySelector('#result')
var form = document.querySelector('#formconnexion')

form.addEventListener('submit', function (e) {
    e.preventDefault()
    result.innerHTML = 'Chargement...'
    var httpRequest = getHttpRequest()
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            result.innerHTML = ''
            if (httpRequest.status === 200) {
                resutl.innerHTML = httpRequest.reponseText
            } else {
                alert("Impossible de contacter le serveur")
            }
        }
    }
})

httpRequest.open('POST', 'main.php', true);

var data = new FormData(formconnexion);
httpRequest.send(data);
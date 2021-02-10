function Menu($scope) {
    $scope.menu = 'conversations'; // Entoure le bouton conversation lors de l'arrivée
    $scope.panel = 1; // Permet de cacher le copyright
    $scope.deployprofil = 1; // Permet le déploiement de la fiche profil
    $scope.deploysupport = 1; // Permet le déploiement de la fiche support
    $scope.deployapropos = 1; // Permet le déploiement de la fiche à propos
    $scope.deployajout = 1; // Permet le déploiement de l'ajout contact
    $scope.deploycontact = 1; // Permet le déploiement de la fiche contact
}

function changeBegin() {
    document.getElementById("menu").classList.remove("begin");
    document.getElementById("profil").classList.remove("begin");
    document.getElementById("support").classList.remove("begin");
    document.getElementById("apropos").classList.remove("begin");
    document.getElementById("ajout").classList.remove("begin");
}

setTimeout(changeBegin,100);
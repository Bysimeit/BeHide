function Menu($scope) {
    $scope.deployinscription = 1; // Permet le déploiement de la fiche inscription
}

function changeBegin() {
    document.getElementById("inscription").classList.remove("begin");
}

setTimeout(changeBegin,100);
function Menu($scope) {
    $scope.menu = 'conversations'; // Entoure le bouton conversation lors de l'arrivée
    $scope.panel = 1;
    $scope.deployprofil = 1;
    $scope.deploysupport = 1;
    $scope.deployapropos = 1;
    $scope.deployajout = 1;
    $scope.deploycontact = 1;
}

function changeBegin(){
    document.getElementById("menu").classList.remove("begin");
    document.getElementById("profil").classList.remove("begin");
    document.getElementById("support").classList.remove("begin");
    document.getElementById("apropos").classList.remove("begin");
    document.getElementById("ajout").classList.remove("begin");
}

setTimeout(changeBegin,100);
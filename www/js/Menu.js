function Menu($scope) {
    $scope.panel = 1;
    $scope.deployprofil = 1;
}

function changeBegin(){
    document.getElementById("menu").classList.remove("begin");
    document.getElementById("profil").classList.remove("begin");
}

setTimeout(changeBegin,100);
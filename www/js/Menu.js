function Menu($scope) {
    $scope.panel = 1;
}

function changeBegin(){
    document.getElementById("menu").classList.remove("begin");
}
setTimeout(changeBegin,100);
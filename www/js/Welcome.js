var random = Math.floor(Math.random() * 5);
var day = new Date();
var heure = day.getHours();

//Midi
if (heure == 12){
    document.getElementById("welcome").innerHTML = "Bon appétit ;)"
}

//
if (random == 1){
    document.getElementById("welcome").innerHTML = "Salut Paul"
}

else if (random == 2){
    document.getElementById("welcome").innerHTML = "Comment allez-vous ?"
}

else if (random == 3){
    document.getElementById("welcome").innerHTML = "Bienvenue Paul"
}

else if (random == 4){
    document.getElementById("welcome").innerHTML = "Bonsoir Paul"
}

else if (random == 5){
    document.getElementById("welcome").innerHTML = "Bonsoir Paul"
}

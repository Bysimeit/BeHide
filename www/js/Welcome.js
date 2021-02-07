var day = new Date();
var heure = day.getHours();

//Midi
if (heure == 12){
    document.getElementById("welcome").innerHTML = "Bon appétit 😉"
}

//Soirée
if (heure > 17 && heure <= 22){
    var random = Math.floor(Math.random() * 3);

    if (random == 0){
        document.getElementById("welcome").innerHTML = "Bonne soirée Paul"
    }
    
    else if (random == 1){
        document.getElementById("welcome").innerHTML = "Une agréable soirée"
    }

    else if (random == 2){
        document.getElementById("welcome").innerHTML = "Pas trop fatigué 😉 ?"
    }
}

//nuit
if (heure > 22 || heure < 5){
    var random = Math.floor(Math.random() * 3);

    if (random == 0){
        document.getElementById("welcome").innerHTML = "Bonne nuit Paul"
    }
    
    else if (random == 1){
        document.getElementById("welcome").innerHTML = "Je vais aller me coucher ^^"
    }

    else if (random == 2){
        document.getElementById("welcome").innerHTML = "J'aime les étoiles"
    }
}

//Matin
if (heure > 5 && heure < 12){
    var random = Math.floor(Math.random() * 3);

    if (random == 0){
        document.getElementById("welcome").innerHTML = "Bonjour Paul 😉"
    }
    
    else if (random == 1){
        document.getElementById("welcome").innerHTML = "Bonne matinée"
    }

    else if (random == 2){
        document.getElementById("welcome").innerHTML = "Une belle journée !!!"
    }
}

//Après midi
if (heure > 12 && heure <= 17){
    var random = Math.floor(Math.random() * 3);

    if (random == 0){
        document.getElementById("welcome").innerHTML = "Comment allez vous ? ^^"
    }
    
    else if (random == 1){
        document.getElementById("welcome").innerHTML = "Belle journée 😉"
    }

    else if (random == 2){
        document.getElementById("welcome").innerHTML = "Quoi de neuf Paul ?"
    }
}


deploymsg = 0;
isButtonOn = 1
isDuration = 1;

function changeStateButton(){
    if(isButtonOn == 1){
        document.getElementById("nav").style.display = "none";
        isButtonOn = 0;
    } else {
        document.getElementById("nav").style.removeProperty("display");
        isButtonOn = 1;
    }
}

function duration(){
    if(isDuration){
        document.getElementById("conv-message").style.transitionDuration = "0s";
        isDuration = 0;
    } else {
        document.getElementById("conv-message").style.removeProperty("transition-duration");
        isDuration = 1;
    }
    
}

function DisplayConv(){

    function display(){
        document.getElementById("conv-message").classList.remove("slidetoleft");
        setTimeout(duration,20);
    }

    document.getElementById("conv-message").classList.remove("message-hide");
    
    changeStateButton();

    //Mettre le scroll tout en bas
    element = document.getElementById('scroll-message');
    element.scrollTop = element.scrollHeight;
    ////

    setTimeout(display,10);
}

function HideConv(){

    function hide(){
        document.getElementById("conv-message").classList.add("message-hide");
    }

    function changeClass(){
        document.getElementById("conv-message").classList.add("slidetoleft");
        changeStateButton();
        setTimeout(hide,450);
    }

    duration();
    setTimeout(changeClass,20);
}

function OptOn(){
    function widthStatut(){
        document.getElementById("statut-msg").classList.add("width-statut")
    }
    document.getElementById("body-message").classList.add("body_change_msg");
    document.getElementById("name-msg").classList.add("nom_change_msg");
    document.getElementById("button-msg-id").classList.add("move-button");
    document.getElementById("statut-msg").classList.add("statut-msg-apparition");
    setTimeout(widthStatut, 900);
}

function OptOff(){
    function widthStatut(){
        document.getElementById("statut-msg").classList.remove("width-statut")
        document.getElementById("statut-msg").classList.remove("statut-msg-apparitionv2");
    }
    document.getElementById("body-message").classList.remove("body_change_msg");
    document.getElementById("name-msg").classList.remove("nom_change_msg");
    document.getElementById("button-msg-id").classList.remove("move-button");
    document.getElementById("statut-msg").classList.remove("statut-msg-apparition");
    document.getElementById("statut-msg").classList.add("statut-msg-apparitionv2");
    setTimeout(widthStatut, 900);
}

function ChangeStateMsg(){
    if(deploymsg==0){
        OptOn();
        deploymsg=1;
    }

    else if(deploymsg==1){
        OptOff();
        deploymsg=0;
    }
}


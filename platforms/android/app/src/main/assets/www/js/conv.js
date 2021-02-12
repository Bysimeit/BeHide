function DisplayConv(){
    function display(){
        document.getElementById("conv-message").classList.remove("slidetoleft");
    }

    document.getElementById("conv-message").classList.remove("message-hide");
    setTimeout(display,10);
}

function HideConv(){
    function hide(){
        document.getElementById("conv-message").classList.add("message-hide");
    }

    document.getElementById("conv-message").classList.add("slidetoleft");
    setTimeout(hide,450);
}
function stableContact(){
    console.log("Contact");
    document.getElementById("pageContact").classList.remove("hide-contact");
    document.getElementById("nomContact").classList.remove("hide-contact");
    document.getElementById("lstcontact").classList.add("noscroll");
    document.getElementById("pageContact").classList.add("apparition-contact");
    document.getElementById("stylephotocontact").classList.add("apparition-contact");
    document.getElementById("photocontact").classList.add("apparition-contact");
}

function hide(){
    document.getElementById("pageContact").classList.add("hide-contact");
    document.getElementById("pageContact").classList.remove("disparition-contact");
    document.getElementById("photocontact").classList.remove("disparition-contact");
    document.getElementById("stylephotocontact").classList.remove("disparition-contact");
    document.getElementById("lstcontact").classList.remove("noscroll");
}

function base(){
    document.getElementById("pageContact").classList.remove("apparition-contact");
    document.getElementById("photocontact").classList.remove("apparition-contact");
    document.getElementById("stylephotocontact").classList.remove("apparition-contact");
    document.getElementById("pageContact").classList.add("disparition-contact");
    document.getElementById("photocontact").classList.add("disparition-contact");
    document.getElementById("stylephotocontact").classList.add("disparition-contact");
    document.getElementById("nomContact").classList.add("hide-contact");
    setTimeout(hide,100);
}
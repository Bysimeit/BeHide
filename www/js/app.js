document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    navigator.splashscreen.hide();
    document.addEventListener("backbutton", function(e) {
        alert("Bouton");
    }, false);
}

var app = angular.module('app', []);

app.config(function($routeProvider) {
    $routeProvider
        .when('/conversations', {templateUrl: 'pages/conversations.html'})
        .when('/appels', {templateUrl: 'pages/appels.html'})
        .when('/contacts', {templateUrl: 'pages/contacts.html'})
        .otherwise({redirectTo: '/conversations'})
});
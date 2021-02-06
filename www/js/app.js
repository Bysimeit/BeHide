document.addEventListener('deviceready', function () {
    // App prête
}, false);

var app = angular.module('app', []);

app.config(function($routeProvider) {
    $routeProvider
        .when('/conversations', {templateUrl: 'pages/conversations.html'})
        .when('/appels', {templateUrl: 'pages/appels.html'})
        .when('/contacts', {templateUrl: 'pages/contacts.html'})
        .otherwise({redirectTo: '/conversations'})
});

function defMenu($scope) {
    $scope.panel = 0;
}

defMenu();
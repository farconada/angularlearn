/**
 * Created by fernando on 28/02/14.
 */
var app = angular.module('myApp', ['ui.bootstrap', 'ngCookies', 'myApp.services']);

app.controller('mainCtrl', function($scope, $cookieStore, $http, TokenHandler){
    $scope.click = function(){
        $http.defaults.headers.common['X-WSSE'] = TokenHandler.getCredentials('admin', 'adminpass');
        $http.get('http://127.0.0.1:8081/data.php').success(function(data, status, headers, config) {
            console.log(status);
            console.log(headers);
            console.log(data);
            return data;
        }).error(function(data, status, headers, config) {
            alert('http error');
        });
    };
});
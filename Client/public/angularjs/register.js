//loading the 'login' angularJS module
var register = angular.module('register', []);
//defining the login controller
register.controller('register', function($scope, $http, $document) {
    $scope.address_added=true;
    $scope.incorrect_card=true;

    $scope.profile = function() {
            window.location.assign("/getregisterProfile");
    };

    $scope.addPost = function() {
        window.location.assign("/getCreateAd");
    };

    $scope.homepage = function() {
        window.location.assign("/successLogin");

    };

    $scope.shopitems = function() {
        window.location.assign("/getShopItems");

    };

    $scope.getCart = function() {
        window.location.assign("/getCart");

    };

    $scope.checkout = function() {
        window.location.assign("/checkout");

    };
    $scope.getMyColletion = function() {
        window.location.assign("/getMyColletion");

    };
    $scope.getMyBoughtItems = function() {
        window.location.assign("/getMyBoughtItems");

    };

    $scope.addShippingAddress = function () {

        $http({
            method : "POST",
            url : '/addShippingAddress',
            data : {
                "name":$scope.name,
                "street" : $scope.street,
                "city" : $scope.city,
                "zipcode" : $scope.zipcode,
                "country" : $scope.country,
                "isPrimary" : $scope.isPrimary

            }
        }).success(function(data)
        {

            if (data.statusCode == 401) {
                $scope.address_added=true;

            }
            else
            {
                $scope.address_added=false;

            }
        }).error(function(error) {
            $scope.address_added=true;
        });
    };

    $scope.checkoutAndProceed = function () {

        $http({
            method : "POST",
            url : '/checkoutAndProceed',
            data : {
                "cardname":$scope.cardname,
                "cardno" : $scope.cardno,
                "expdate" : $scope.expdate,
                "securitycode" : $scope.securitycode,

            }
        }).success(function(data)
        {

            if (data.statusCode == 401) {
                $scope.incorrect_card=false;

            }
            else
            {
                window.location.assign("/successLogin");

            }
        }).error(function(error) {
            $scope.address_added=true;
        });
    };

    $scope.submitOffer = function () {

        $http({
            method : "POST",
            url : '/submitOffer',
            data : {

                "itemid" :document.getElementById("Item").innerHTML,
                "bidAmount" : $scope.bidAmount

            }
        }).success(function(data)
        {

            if (data.statusCode == 401) {

                $scope.address_added=true;

            }
            else
            {
                $scope.address_added=false;

            }
        }).error(function(error) {
            $scope.address_added=true;
        });
    };
})

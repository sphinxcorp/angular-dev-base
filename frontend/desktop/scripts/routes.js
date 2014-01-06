(function() {
  var Config;

  Config = (function() {
    function Config($routeProvider, $locationProvider) {
      // define custom routes here


      $locationProvider.html5Mode(true);
    }

    return Config;

  })();

  angular.module('app').config(['$routeProvider', '$locationProvider', Config]);

}).call(this);

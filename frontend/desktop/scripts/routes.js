(function() {
  var Config;

  Config = (function() {
    function Config($routeProvider) {
      // define custom routes here
    }

    return Config;

  })();

  angular.module('app').config(['$routeProvider', Config]);

}).call(this);

(function() {
  var Config;

  Config = (function() {
    function Config($routeProvider) {
      $routeProvider.when('/github/:id', {
        controller: 'gitHubController'
      }).otherwise({
        redirectTo: '/github'
      });
    }

    return Config;

  })();

  angular.module('app').config(['$routeProvider', Config]);

}).call(this);

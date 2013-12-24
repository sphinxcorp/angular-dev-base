(function() {
  var Service;

  Service = (function() {
    function Service($log, $rootScope) {
      this.$log = $log;
      this.$rootScope = $rootScope;
    }

    Service.prototype.publish = function(name, parameters) {
      var params;
      params = angular.extend({}, parameters, {
        timeStamp: Date.now()
      });
      return this.$rootScope.$broadcast(name, params);
    };

    Service.prototype.subscribe = function(name, listener) {
      return this.$rootScope.$on(name, listener);
    };

    return Service;

  })();

  angular.module('app').service('messageService', ['$log', '$rootScope', Service]);

}).call(this);

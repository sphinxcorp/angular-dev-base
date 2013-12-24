(function() {
  var Service;

  Service = (function() {
    var urlBase;

    urlBase = '/people';

    function Service($log, $http) {
      this.$log = $log;
      this.$http = $http;
    }

    Service.prototype.get = function() {
      return this.$http.get(urlBase).then(function(results) {
        return results.data;
      });
    };

    Service.prototype.getPerson = function(id) {
      return this.$http.get("" + urlBase + "/" + id).then(function(results) {
        return results.data;
      });
    };

    Service.prototype.save = function(person) {
      return this.$http.post("" + urlBase, person).error(function(results, status) {
        return {
          results: results,
          status: status
        };
      });
    };

    return Service;

  })();

  angular.module('app').service('personService', ['$log', '$http', Service]);

}).call(this);

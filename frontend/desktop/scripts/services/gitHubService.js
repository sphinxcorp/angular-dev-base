(function() {
  var Service;

  Service = (function() {
    function Service($log, $http, messageService) {
      this.$log = $log;
      this.$http = $http;
      this.messageService = messageService;
    }

    Service.prototype.get = function(criteria) {
      var _this = this;
      return this.$http.jsonp("https://api.github.com/users/" + criteria + "/repos", {
        params: {
          callback: 'JSON_CALLBACK'
        }
      }).success(function(results) {
        return _this.messageService.publish('search', {
          source: 'GitHub',
          criteria: criteria
        });
      }).error(function(results) {
        return _this.$log.error('gitHubService error', results);
      }).then(function(results) {
        return results.data.data;
      });
    };

    return Service;

  })();

  angular.module('app').service('gitHubService', ['$log', '$http', 'messageService', Service]);

}).call(this);

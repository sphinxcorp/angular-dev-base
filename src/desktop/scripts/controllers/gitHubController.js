(function() {
  var Controller;

  Controller = (function() {
    function Controller($log, gitHubService) {
      var _this = this;
      this.$log = $log;
      this.gitHubService = gitHubService;
      this.search = function(searchTerm) {
        return _this.gitHubService.get(searchTerm).then(function(results) {
          return _this.repos = results;
        });
      };
    }

    return Controller;

  })();

  angular.module('app').controller('gitHubController', ['$log', 'gitHubService', Controller]);

}).call(this);

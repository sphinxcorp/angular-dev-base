(function() {
  var Controller;

  Controller = (function() {
    function Controller($log, messageService) {
      var _this = this;
      this.$log = $log;
      this.messageService = messageService;
      this.searchHistory = [];
      this.messageService.subscribe('search', function(name, parameters) {
        return _this.searchHistory.push(parameters);
      });
    }

    return Controller;

  })();

  angular.module('app').controller('searchHistoryController', ['$log', 'messageService', Controller]);

}).call(this);

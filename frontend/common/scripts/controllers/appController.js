(function() {
  var Controller;

  Controller = (function() {
    function Controller(bracketService, $scope, $log, liveFeed) {
      bracketService.loadBrackets().then(function(brackets){
      	liveFeed.subscribe(function(eventName, updates){
      		bracketService.updateMatchStates("live", updates.data);
      	}, {
      		"eventName": "match-update"
      	});
      });
    }

    return Controller;

  })();

  angular.module('app').controller('appController', ['bracketService', '$scope', '$log', 'liveFeed', Controller]);

}).call(this);

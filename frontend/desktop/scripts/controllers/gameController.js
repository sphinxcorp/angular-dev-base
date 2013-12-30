(function() {
  var Controller;

  Controller = (function() {
    function Controller($scope, $log, liveFeed) {
      liveFeed.subscribe(function(eventName, eventData){
        $log.info(eventName + ' triggered in gameController');
        $log.info(eventData);
        $scope.game = eventData.data;
      }, {
        scope: $scope
      });
    }

    return Controller;

  })();

  angular.module('app').controller('gameController', ['$scope', '$log', 'liveFeed', Controller]);

}).call(this);

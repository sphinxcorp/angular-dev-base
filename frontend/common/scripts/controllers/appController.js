(function() {
  var Controller;

  Controller = (function() {
    function Controller(bracketService, $scope, $log, liveFeed) {
      liveFeed.subscribe(function(eventName, updates){
        if(eventName === 'livefeed:$connected'){
          // livefeed is connected, so application is online & safe to resume data loading or user interactions
          $log.info('livefeed connected');
          if(!bracketService.bracketsLoaded()){ // brcakets not loaded

            bracketService.loadBrackets().then(function(brackets){
              // after brcakets are loaded any state updating feed updates should be registered here, like match-update etc.
              liveFeed.subscribe(function(eventName, updates){
                bracketService.updateMatchStates("live", updates.data);
              }, {
                "eventName": "match-update"
              });

            });

          }
        }
        else if(eventName === 'livefeed:$disconnected'){
          $log.info('livefeed disconnected');
          // livefeed goes offline
          // disable full or partial user interactions here like showing a modal popup saying intenret is down 
          // or disabling some features only like making picks or group administration etc.
          // what should be done exactly will be decided later and implemented as per spec
        }
      });
    }

    return Controller;

  })();

  angular.module('app').controller('appController', ['bracketService', '$scope', '$log', 'liveFeed', Controller]);

}).call(this);

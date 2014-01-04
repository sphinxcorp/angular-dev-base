(function() {
  var Service;

  Service = (function() {
    function Service($rootScope, $log, $http, serviceUrls, messageService, $q) {

      function loadData(){
        var resourceTypes = Array.prototype.slice.call(arguments);

        if(arguments.length === 0){
          return null;
        }

        var resourceType = resourceTypes.shift();
        var _this = this;

        return $http.get(serviceUrls[resourceType])
          .success(function(results) {
            $log.info(resourceType + ' loaded successfully');
            return messageService.publish('data:loaded', resourceType);
          }).error(function(results) {
            return $log.error('bracketService error: ' + resourceType, results);
          }).then(function(results){
            $rootScope[resourceType] = results.data;
            if(resourceTypes.length > 0){
              return loadData.apply(_this, resourceTypes);
            }
            return $rootScope[resourceType];
          });
      }

      var svc = {
        loadBrackets: function($purge) {
          $purge = !!$purge;

          if(!$purge && $rootScope.brackets){
            $log.info('brackets already loaded');  
            var deferred = $q.defer();
            var promise = deferred.promise;
            promise.then(function(value){
              return value;
            });
            deferred.resolve($rootScope.brackets);
            return promise;
          }

          $log.info('loading brackets');

          return loadData.call(this, 'rounds', 'regions', 'teams', 'brackets');
        },
        updateMatchStates: function(bracket, matchStates){
          $log.info('updating matchStates');
          this.loadBrackets().then(function(brackets){
            var matches = $rootScope.brackets[bracket];
            matchStates = angular.isArray(matchStates)?matchStates:[matchStates];
            angular.forEach(matchStates, function(matchState){
              if(matches['match-' + matchState.id]){
                angular.extend(matches['match-' + matchState.id], matchState);
              }
            });
          })
        }
      }

      return svc;
    }

    return Service;

  })();

  angular.module('app').service('bracketService', ['$rootScope', '$log', '$http', 'serviceUrls', 'messageService', '$q', Service]);

}).call(this);

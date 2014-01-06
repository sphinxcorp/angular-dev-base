(function() {
  var Service;

  Service = (function() {
    function Service($rootScope, $log, $http, serviceUrls, messageService, $q) {

      var bracketService = {
        getData: function(){
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
              $rootScope["__" + resourceType] = results.data;
              if(resourceTypes.length > 0){
                return bracketService.getData.apply(_this, resourceTypes);
              }
              return $rootScope["__" + resourceType];
            });
        },
        loadBrackets: function($purge) {
          $purge = !!$purge;

          if(!$purge && bracketService.bracketsLoaded()){
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

          return bracketService.getData.call(this, 'rounds', 'regions', 'teams', 'brackets');
        },
        bracketsLoaded: function(){
          return !!$rootScope.__brackets;
        },
        updateMatchStates: function(bracket, matchStates){
          if(!bracketService.bracketsLoaded()){
            $lof.info('brackets not loaded. nothing to update');
            return;
          }

          $log.info('updating matchStates');
          var bracket = bracketService.getBracket(bracket);
          matchStates = angular.isArray(matchStates)?matchStates:[matchStates];
          angular.forEach(matchStates, function(matchState){
            if(bracket['match-' + matchState.id]){
              angular.extend(bracket['match-' + matchState.id], matchState);
            }
          });
        }
      };

      var accessorMethods = {
        getBrackets: function(){
          if($rootScope.__brackets){
            return $rootScope.__brackets;
          }
          return {};
        },
        getBracket: function(bracketName){
          if(bracketService.bracketsLoaded()){
            return $rootScope.__brackets[bracketName];
          }
          return {};
        },
        getRounds: function(){
          if($rootScope.__rounds){
            return $rootScope.__rounds;
          }
          return {};
        },
        getRound: function(id){
          if($rootScope.__rounds){
            return $rootScope.__rounds['round-' + id];
          }
          return {};
        },
        getRegions: function(){
          if($rootScope.__regions){
            return $rootScope.__regions;
          }
          return {};
        },
        getRegion: function(id){
          if($rootScope.__regions){
            return $rootScope.__regions['region-' + id];
          }
          return {};
        },
        getTeams: function(){
          if($rootScope.__teams){
            return $rootScope.__teams;
          }
          return {};
        },
        getTeam: function(id){
          if($rootScope.__teams){
            return $rootScope.__teams['team-' + id];
          }
          return {};
        }
      };

      angular.extend($rootScope, accessorMethods);
      angular.extend(bracketService, accessorMethods);

      return bracketService;
    }

    return Service;

  })();

  angular.module('app').service('bracketService', ['$rootScope', '$log', '$http', 'serviceUrls', 'messageService', '$q', Service]);

}).call(this);

(function() {
  var Service;

  Service = (function(undefined) {
    function Service($rootScope, $log, $http, serviceUrls, messageService, $q) {

      var loadAndCacheInitialData = function(){
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
            $rootScope["_" + resourceType] = results.data;
            if(resourceTypes.length > 0){
              return loadAndCacheInitialData.apply(_this, resourceTypes);
            }
            return $rootScope["_" + resourceType];
          });
      };

      var bracketService = {
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

          return loadAndCacheInitialData.call(this, 'rounds', 'regions', 'teams', 'brackets');
        },
        bracketsLoaded: function(){
          return !!$rootScope._brackets;
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
            var match = bracketService.getMatch(bracket, matchState.id);
            if(match){
              angular.extend(match, matchState);
            }
          });
        }
      };

      var utilityMethods = {
        filterByProp: function(objects, propName, propValue){
          var filtered = [];
          angular.forEach(objects, function(obj){
            if((angular.isArray(propValue) && propValue.indexOf(obj[propName])>=0) || obj[propName] === propValue) {
              filtered.push(obj);
            }
          });

          return filtered;
        },
        groupByProp: function(objects, propName){
          var hash = {};
          var hashValues = [];
          angular.forEach(objects, function(obj){
            var propValue = obj[propName];
            var hashKey = propName + '-' + propValue;
            if(undefined === hash[hashKey]){
              hashValues.push(propValue);
              hash[hashKey] = [];
            }
            hash[hashKey].push(obj);
          });
          return {
            "hashValues": hashValues,
            "hash": hash
          };
        },
        hashToArray: function(hash){
          var arr = [];
          angular.forEach(hash, function(value){
            arr.push(value);
          });
          return arr;
        }
      }

      var dataAccessMethods = {
        getBrackets: function(){
          if($rootScope._brackets){
            return $rootScope._brackets;
          }
          return [];
        },
        getBracket: function(bracketName){
          if(bracketService.bracketsLoaded()){
            return $rootScope._brackets[bracketName];
          }
          return null;
        },
        getMatch: function(bracket, matchId){
          if(typeof bracket === 'string'){
            bracket = this.getBracket(bracket);
          }

          if(!bracket || bracket['matches'] === undefined){
              return null;
          }
          return bracket.matches["match-" + matchId];
        },
        getRounds: function(asArray){
          asArray = !!asArray;
          if($rootScope._rounds){
            return asArray?utilityMethods.hashToArray($rootScope._rounds):$rootScope._rounds;
          }
          return null;
        },
        getRound: function(id){
          if($rootScope._rounds){
            return $rootScope._rounds["round-" + id];
          }
          return null;
        },
        getRegions: function(asArray){
          asArray = !!asArray;
          if($rootScope._regions){
            return asArray?utilityMethods.hashToArray($rootScope._regions):$rootScope._regions;
          }
          return null;
        },
        getRegion: function(id){
          if($rootScope._regions){
            return $rootScope._regions["region-" + id];
          }
          return null;
        },
        getTeams: function(asArray){
          asArray = !!asArray;
          if($rootScope._teams){
            return asArray?utilityMethods.hashToArray($rootScope._teams):$rootScope._teams;
          }
          return null;
        },
        getTeam: function(id){
          if($rootScope._teams){
            return $rootScope._teams["team-" + id];
          }
          return null;
        }
      };

      /* Expose common data access methods to both $rootScope and bracketService objects */

      angular.extend($rootScope, dataAccessMethods, utilityMethods);
      angular.extend(bracketService, dataAccessMethods);

      return bracketService;
    }

    return Service;

  })();

  angular.module('app').service('bracketService', ['$rootScope', '$log', '$http', 'serviceUrls', 'messageService', '$q', Service]);

}).call(this);

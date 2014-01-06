(function() {
  var Factory;
  
  Factory = (function() {

    function Factory($log, $rootScope, messageService, $timeout) {
      var _eventNS = 'livefeed';
      var _socketUrl = '/livefeed';

      var _sock, _connected = false;

      var liveFeed = {
        autoReconnect: true,
        reconnectInterval: 3
      };

      liveFeed.connect = function(){

        if(_sock && _sock instanceof SockJS){
          return;
        }

        _sock = new SockJS(_socketUrl);
        $log.info('socket created');

        _sock.onopen = function(e){
          $log.info('websocket connected');
          _connected = true;
          messageService.publish(_eventNS + ":$connected", {
            "_eventName": "$connected",
            "_eventType": "internal",
            "data": null
          });
        };

        _sock.onmessage = function(e) {
          $log.info('feed update recieved');
          var update = angular.fromJson(e.data);

          if(update['updateType']){
            $log.info(_eventNS + ":" + update['updateType']);
            messageService.publish(_eventNS + ":" + update['updateType'], {
              "data": update['updateDetails']
            });

            update = {
              "_eventName": update['updateType'],
              "_eventType": "external",
              "data": update['updateDetails']
            };
          }
          else{
            update = {
              "_eventName": null,
              "_eventType": "external",
              "data": update
            }
          }
          messageService.publish(_eventNS, update);
        };

        _sock.onclose = function(e){
          $log.info('websocket closed');
          _sock = null;
          if(liveFeed.autoReconnect){
            $log.info('attempting reconnection after ' + liveFeed.reconnectInterval + ' seconds');
            $timeout(function() {
              liveFeed.connect();
            }, liveFeed.reconnectInterval * 1000);
          }
          messageService.publish(_eventNS + ":$disconnected", {
            "_eventName": "$disconnected",
            "_eventType": "internal",
            "data": null
          });
        };

        return this;
      };

      liveFeed.connected = function () {
        return (_sock && _sock instanceof SockJS && _sock.readyState === SockJS.OPEN);
      }

      liveFeed.subscribe = function (callback, options){
        var that = this, 
          eventName = _eventNS, 
          scope = $rootScope;

        if(options && options.eventName && options.eventName !== _eventNS){
          eventName = _eventNS + ":" + options.eventName;
        }

        if(options && options.scope){
          scope = options.scope;
        }

        var events = [eventName];

        if(eventName === _eventNS){
          events.push(_eventNS + ":$connected");
          events.push(_eventNS + ":$disconnected");
        }

        angular.forEach(events, function(eventName){
          messageService.subscribe(eventName, function(name, data){
            $log.info(eventName + ' triggered in liveFeed');
            scope.$apply(function(){
              callback.call(scope, eventName, data);
            });
          });  
        });

        return this;        
      };

      liveFeed.disconnect = function(){
        if(this.connected()){
          liveFeed.autoReconnect = false;
          _sock.close();
        }
        return this;
      }

      liveFeed.connect();

      return liveFeed; 
    }

    return Factory;
    
  })();

  angular.module('app').factory('liveFeed', ['$log', '$rootScope', 'messageService', '$timeout', Factory]);

}).call(this);

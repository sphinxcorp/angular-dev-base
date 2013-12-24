(function() {
  var Controller, Directive;

  Controller = (function() {
    function Controller($log) {
      var _this = this;
      this.tabs = [];
      this.select = function(tab) {
        tab.transcluded = true;
        if (tab.selected === true) {
          return;
        }
        angular.forEach(_this.tabs, function(tab) {
          return tab.selected = false;
        });
        return tab.selected = true;
      };
      this.addTab = function(tab) {
        tab.transcluded = true;
        if (_this.tabs.length === 0) {
          _this.select(tab);
        }
        return _this.tabs.push(tab);
      };
    }

    return Controller;

  })();

  Directive = (function() {
    function Directive($log) {
      return {
        controller: ['$log', Controller],
        controllerAs: 'controller',
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: '/desktop/views/directives/tabs.html',
        transclude: true
      };
    }

    return Directive;

  })();

  angular.module('app').directive('appTabs', ['$log', Directive]);

}).call(this);

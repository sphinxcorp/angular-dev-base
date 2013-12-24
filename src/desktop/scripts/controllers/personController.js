(function() {
  var Controller;

  Controller = (function() {
    function Controller($log, personService) {
      var setPeople,
        _this = this;
      this.$log = $log;
      this.personService = personService;
      setPeople = function() {
        return _this.personService.get().then(function(results) {
          return _this.people = results;
        });
      };
      this.insertPerson = function(person) {
        return _this.personService.save(person).success(function(results) {
          _this.error = '';
          _this.person = {};
          return setPeople();
        }).error(function(results, status) {
          if (status === 403) {
            return _this.error = results;
          }
        }).then(function(results) {
          return results;
        });
      };
      setPeople();
    }

    return Controller;

  })();

  angular.module('app').controller('personController', ['$log', 'personService', Controller]);

}).call(this);

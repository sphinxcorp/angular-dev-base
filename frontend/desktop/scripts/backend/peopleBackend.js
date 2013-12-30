(function() {
  var Run;

  Run = (function() {
    function Run($log, $httpBackend) {
      var nextId, people;
      this.$log = $log;
      this.$httpBackend = $httpBackend;
      nextId = 0;
      people = [
        {
          id: nextId++,
          name: 'Saasha',
          age: 6
        }, {
          id: nextId++,
          name: 'Planet',
          age: 8
        }
      ];
      this.$httpBackend.whenGET('/people').respond(people);
      this.$httpBackend.whenPOST('/people').respond(function(method, url, data) {
        var isUnique, message, name, p, person;
        person = angular.fromJson(data);
        name = person.name;
        isUnique = ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = people.length; _i < _len; _i++) {
            p = people[_i];
            if (p.name === name) {
              _results.push(name);
            }
          }
          return _results;
        })()).length === 0;
        if (!isUnique) {
          message = {
            title: 'Duplicate!',
            message: "" + name + " is a duplicate.  Please enter a new name."
          };
          return [403, message];
        }
        person.id = nextId++;
        people.push(person);
        return [200, person];
      });
    }

    return Run;

  })();

  angular.module('app').run(['$log', '$httpBackend', Run]);

}).call(this);

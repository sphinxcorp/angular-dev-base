/*
objectOrderBy filter is needed to sort hash objects such as teams, regions, rounds or bracket.matches

For more information refer to http://justinklemm.com/angularjs-filter-ordering-objects-ngrepeat/
*/

(function() {
  var Filter;

  Filter = (function() {
    function Filter() {
      return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
          filtered.push(item);
        });
        filtered.sort(function (a, b) {
          if(a[field] > b[field]) return 1;
          if(a[field] < b[field]) return -1;
          return 0;
        });
        if(reverse) filtered.reverse();
        return filtered;
      };
    }

    return Filter;

  })();

  angular.module('app').filter('orderObjectBy', Filter);

}).call(this);
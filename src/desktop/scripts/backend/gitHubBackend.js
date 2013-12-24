(function() {
  var Run;

  Run = (function() {
    function Run($log, $httpBackend) {
      this.$log = $log;
      this.$httpBackend = $httpBackend;
      this.$httpBackend.whenJSONP(/api.github.com/).passThrough();
    }

    return Run;

  })();

  angular.module('app').run(['$log', '$httpBackend', Run]);

}).call(this);

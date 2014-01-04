(function() {
  var Factory;

  var _baseUrl = "/api";

  var _urls = {};

  _urls.teams = _baseUrl + "/teams";

  _urls.rounds = _baseUrl + "/rounds";

  _urls.regions = _baseUrl + "/regions";

  _urls.brackets = _baseUrl + "/brackets";
  
  _urls.originalBracket = _urls.brackets + "/original";

  _urls.liveBracket = _urls.brackets + "/live";

  _urls.makePick = _baseUrl + "/make-pick"
  
  Factory = function ($log) {
  		return _urls;
  }

  angular.module('app').factory('serviceUrls', ['$log', Factory]);

}).call(this);
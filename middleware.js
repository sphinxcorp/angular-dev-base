(function() {
  module.exports = function(connect, options) {
    var app, express, routes, api;
    express = require('express');
    routes = require('./routes');
    api = require('./api');
    app = express();
    app.configure(function() {
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(express.errorHandler());
      app.use(express["static"](options.base));
      app.use(app.router);
      api(connect, app, options);
      return routes(app, options);
    });
    return [connect(app)];
  };

}).call(this);

(function() {
  module.exports = function(app, options) {
    app.get('/', function(req, res) {
      return res.redirect("/desktop");
    });

    app.get('/desktop', function(req, res) {
      return res.render("" + options.base + "/desktop/index.html");
    });

    app.get('/phone', function(req, res) {
      return res.render("" + options.base + "/phone/index.html");
    });

    app.get('/tablet', function(req, res) {
      return res.render("" + options.base + "/phone/index.html");
    });
  };
}).call(this);

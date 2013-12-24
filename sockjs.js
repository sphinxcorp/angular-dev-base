(function() {
  module.exports = function(server, connect) {
    var sockjs = require('sockjs');
    var path = require('path');
    var glob = require('glob');
    var fs = require('fs');

    var socketOptions = {
      sockjs_url: "http://cdn.sockjs.org/sockjs-0.3.min.js",
      prefix: '/livefeed'
    };
    
    var options = {
      interval: 1000,
      dataPath: __dirname + '/mock-data/livefeed/'
    }

    var connections = [], tref = null, currentFileIndex = null;

    var dataFiles = glob.sync('*.json',{
      cwd: options.dataPath,
      silent: true
    });

    if(dataFiles.length === 0){
      console.log('\n\nNo mock data file found at ' + options.dataPath);
      console.log('Even though the socket server will work, no broadcasting will happen.\n\n');
      return;
    }

    currentFileIndex = 0;
    var broadcast = function() {
      var data = fs.readFileSync(options.dataPath + dataFiles[currentFileIndex],{
        encoding: 'UTF-8'
      });

      for (var ii=0; ii < connections.length; ii++) {
        connections[ii].write(data);
        console.log('data written to connection ' + ii);
      }
      currentFileIndex = ++currentFileIndex % dataFiles.length;
      tref = setTimeout(broadcast, 1000);
    };

    var socketServer = sockjs.createServer(socketOptions);
    
    socketServer.on('connection', function(conn) {
      console.log('connection started');
      if(tref === null){
        console.log('initializing broadcast');
        tref = setTimeout(broadcast, 1000);
      }
      
      connections.push(conn);

      conn.on('close', function() {
        connections.splice(connections.indexOf(conn),1);
        if(connections.length === 0){
          clearTimeout(tref);
          tref = null;
          console.log('broadcast terminated');
        }
      });
    });

    socketServer.installHandlers(server);

  };

}).call(this);

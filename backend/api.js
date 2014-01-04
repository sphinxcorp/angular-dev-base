(function() {
	var rest = require('connect-rest');
	var fs = require('fs');
	var glob = require('glob');

	var options = {
		discoverPath: 'discover',
    	protoPath: 'proto',
		context: "/api"
	};

	var dataPath = __dirname + '/mock-data/api/';

	var makeResponse = function(method, resourcePath, callback){
		
	}

	var handler = function(request, content, callback){
		var resource = request.params.resource;
		var method = request.headers.method.toLowerCase();

		if(!resource){
			var error = new Error('resource is missing');
			error.statusCode = 400;
			return callback( error );
		}

		var resourcePath = dataPath + method + '/' + resource;

		var data = {};

		if(fs.existsSync(resourcePath) && fs.statSync(resourcePath).isDirectory()){
			var dataFiles = glob.sync('*.json',{
      			cwd: resourcePath,
      			silent: true
    		});

    		for(var fileIndex=0; fileIndex < dataFiles.length; fileIndex++){
    			var fileName = dataFiles[fileIndex];
    			var dataKey = fileName.replace(/\.json$/,'');

    			data[dataKey] = JSON.parse(
					fs.readFileSync(resourcePath + '/' + fileName,{
						encoding: 'UTF-8'
					})
				);
    		}
		}
		else {
			resourcePath = resourcePath + '.json';
			if(!fs.existsSync(resourcePath)){
				var error = new Error('resource not found');
				error.statusCode = 404;
				return callback( error );
			}

			data = JSON.parse(
				fs.readFileSync(resourcePath,{
					encoding: 'UTF-8'
				})
			);
		}

		return callback(null, data);
	};

	module.exports = function(connect, app, options) {
		app.use(connect.query());
		app.use( rest.rester( options ) );

		rest.assign(['get','post','put','delete'],"/*resource", handler);
	};
	
	
}).call(this);
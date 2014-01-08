# Realtime Brackets Frontend

This project is based on a customized & extended version of the wonderful [AngularFun](https://github.com/CaryLandholt/AngularFun) reference architecture project, for angularjs based app development, that leverages modern technologies & build tools to ease development using requirejs based autoloading of app scripts, while minimizes all those resources in a minified version of script. It also establishes strong use of angular development best practices as well as modular architecture for development & management of large applications ensuring scalability. For more information, read the instructions in original [AngularFun](https://github.com/CaryLandholt/AngularFun) project, rest of the document and the supplied code.

## Setup Instructions

* Install [nodejs](http://nodejs.org/download/) version v0.10.21 or higher with npm support
* Install following node modules globally ```npm install -g grunt-cli bower```
* Open a console & navigate to project directory (this directory) and issue ``` npm install ``` command to setup all dependencies

## Available grunt commands

* ```grunt build``` - build task for development
* ```grunt``` or ```grunt dev``` - execute build task for development, run server in development mode with mock backend, open browser & start watching for changes
* ```grunt prod``` - build production ready minified version of scripts, assets & angular views
* ```grunt server``` - run server in production mode & open a browser. Issue this command only after a production build

## Project structure

### Frontend Development Base

```
frontend/
├── assets 								-- assets from markup development project should be placed here
│   ├── css
│   │   ├── desktop
│   │   │   └── styles.css
│   │   ├── mobile
│   │   │   └── styles.css
│   │   └── tablet
│   │       └── styles.css
│   ├── images
│   └── js
├── common 								-- common codes shared to application for all devices will go here
│   └── scripts
│       ├── backend 					-- any type of mocking backends should go here, which will be used during development
│       │   └── apiBackend.js
│   	│   └── viewsBackend.js
│       ├── controllers					-- all common controllers will go here. may be no more left to be implemented
│       │   └── appController.js 		-- base application controller shared to all device. loads initialization data & integrates app with socket server
│       ├── directives					-- all reusable directives will go here
│       ├── factories					-- all shared factory definitions will go here
│       │   ├── liveFeed.js  			-- websocket implementation service with sockjs, publishes various events to be consumed from controllers or other app components, using messageService service component
│       │   └── serviceUrls.js   		-- all api/webservice urls to communicate with backend must be configured here, and referenced via this factory instance
│       ├── filters						-- all shared filters will go here
│       ├── interceptors				-- all interceptors will go here, might not be necessary
│       │   └── dispatcher.js
│       └── services					-- all shared service definitions will go here
│           ├── bracketService.js    	-- generic service to communicate with the backend api/webservices
│           └── messageService.js    	-- generic pub/sub messaging service to be used within cross component communication
├── desktop
│   ├── index.html  					-- SPA entry point for desktop inteface. should include the base layout
│   ├── scripts
│   │   ├── backend
│   │   ├── controllers
│   │   ├── directives
│   │   ├── factories
│   │   ├── filters
│   │   ├── interceptors
│   │   ├── routes.js 					-- all in-app routes for desktop frontend should be defined here
│   │   └── services
│   └── views
│       └── site.html 					-- main content section for the spa. should include child views as per application states
├── phone
│   ├── index.html
│   ├── scripts
│   │   ├── backend
│   │   ├── controllers
│   │   ├── directives
│   │   ├── filters
│   │   ├── interceptors
│   │   └── services
│   └── views
│       └── directives
└── tablet
    ├── index.html
    ├── scripts
    │   ├── backend
    │   ├── controllers
    │   ├── directives
    │   ├── filters
    │   ├── interceptors
    │   └── services
    └── views
        └── directives
```


### Mock backend node services for webservice api & livefeed websocket

```
backend
├── api.js 								-- rest api handler to serve json data files from mock-data/api/{http-request-method}/ folder
├── middleware.js 						-- connect middle ware for node express server
├── mock-data 							-- data files to be served by api & socketServer services
│   ├── api
│   │   ├── delete 						-- will serve json files for DELETE requests
│   │   ├── get 						-- will serve json files for GET requests
│   │   │   ├── brackets 				-- will serve a hash of all containing json files if /api/brackets is requested
│   │   │   │   ├── live.json 			-- will be served on GET request for /api/brackets/live 
│   │   │   │   └── original.json 		-- will be served on GET request for /api/brackets/original
│   │   │   ├── gen-brackets.js 		-- helper genrator of brackets. should never be altered by frontent team
│   │   │   ├── gen-teams.js 			-- helper generator of teams. should never be altered by frontend team
│   │   │   ├── regions.json 			-- will be served on GET request for /api/regions
│   │   │   ├── rounds.json 			-- will be served on GET request for /api/rounds
│   │   │   └── teams.json 				-- will be served on GET request for /api/teams
│   │   ├── post 						-- will serve json files for POST requests
│   │   └── put 						-- will serve json files for PUT requests
│   └── livefeed 						-- json files from this folder will be served via websocket in roud-robin fasion with 1 second interval
│       ├── 01.json
│       ├── 02.json
│       ├── 03.json
│       ├── 04.json
│       └── 05.json
├── routes.js 							-- basic express routes handler to serve host pages for various devices, /desktop is default
└── socketServer.js 					-- websocket handler to serve json files in mock-data/livefeed folder periodically to all connected sockets
```

## Development guidelines

* **frontend/common** folder should contain only the code that can be shared to frontend app for all devices, any device specific code must go into the **frontend/{device_name}** folder
* All view (.html) files must be referenced in other views or routes with urls starting with **/**. This is crucial for the minified build to work, that will embed all view files into the minified script & put into the templace cache.
* All angular components must be registered with array notaion to specify their dependency explicitly. No auto-discovery will be supported in production build. Look at the existing files in **common** folder for reference implementations.
* Update **index.html** files with actual asset references when assets will be imported from markup project
* Review, understand & play with provided code before starting with the actual implementation. 
* **Note** that all data provided by current mockup backend are based on very intial level of analysis, and the final data format might very. Also the frontend team might have their suggestions about the data format & structure, that will be considered positively by the backened developers, if that doesn't violate any constraint for the backend architecture or business logic. So, please come up with suggestions about the data format & structure & discuss as necessary to finalize.
* The the sample implemntation as a reference but we always appreciate best possible code. So, feel free to update any part of provided code to improve performance, maintainability or extensibility.
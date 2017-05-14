#!/bin/env node

//  OpenShift sample Node application
var ip = require("ip");
//console.dir ( ip.address() );

var express = require('express');
var fs      = require('fs');
var rsj 	= require('rsj');
var cors    = require('cors');
var sanitizer = require('sanitizer');
//var htmlparser = require("htmlparser2");
var htmlToText = require('html-to-text');
var feedProcessing = require('./server/feedProcessing.js').FeedProcessing;

var CRITIKAT_RSS_FEED_MONITORING_PERIOD = 24 * 1000;
var CRITIKAT_FEED_TITLE_MAX_LENGTH = 18;
var CRITIKAT_HOST_SERVER_PORT = 8084;

//var CRITIKAT_REMOTE_HOST_NAME = 'http://spip.critikat.com/';
var CRITIKAT_REMOTE_HOST_NAME = 'http://www.critikat.com/';
//var critikatRemoteSpipFileName = CRITIKAT_REMOTE_HOST_NAME + 'spip.php?page=backend';
//var critikatRemoteSpipFileName = 'http://192.168.1.123:8100/rss.xml';
var critikatRemoteSpipFileName  = CRITIKAT_REMOTE_HOST_NAME + 'feed';


var critikatLocalJsonFileName = './rssFeed.json';


function requestXmlFromCritikat() {

		var options = {
	    url: critikatRemoteSpipFileName,
	    headers: {
	      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
	      'Referer': 'http://www.critikat.com/'
	    }
	  };

	rsj.r2j(options, function(jsonString) {

	  /*
	  fs.writeFile('test.json', JSON.stringify(jsonString), function (err) {
		if (err) return //console.log(err);
		//console.log('json a été écrit');
	  });
	  */

		var json = JSON.parse(jsonString);
        //json.id = json.$$hashKey;
    //console.log(jsonString);
		//var jsonWithImageKey = feedProcessing.createImageKeyFromContentEncoded(json, CRITIKAT_REMOTE_HOST_NAME);
  	console.log("BEFORE calling... createShortSynopsisKeyFromSummary");
		var jsonWithSynopsisKey = feedProcessing.createShortSynopsisKeyFromSummary(jsonString, CRITIKAT_FEED_TITLE_MAX_LENGTH);
  	console.log("AFTER calling... createShortSynopsisKeyFromSummary");
		//var jsonWithTitleKey = feedProcessing.createOneLineBasedTitleKeyFromSummary(jsonWithSynopsisKey);
    //    var jsonWithIdKey = feedProcessing.createIdKeyFromHash(jsonWithTitleKey);
		//var jsonWithDescriptionKey = feedProcessing.overrideDescriptionKey(jsonWithIdKey);

		console.log("BEFORE calling... createImageKeyFromContentEncoded");
		feedProcessing.createImageKeyFromContentEncoded(jsonWithSynopsisKey).then(function(response) {
		  	//console.log("Success!", response.slice(0,32));
					//var res = response.slice(1, 32);
					//console.log("Success!  res[0]['imageSmall'] ==  " + JSON.stringify(res[0]['imageSmall']));
					fs.exists(critikatLocalJsonFileName, function(exists) {
					  if(exists) {
							//Show in green
							console.log('File exists. Deleting now ...');
							fs.unlink(critikatLocalJsonFileName);
					  } else {
							//Show in red
							console.log('File not found, so not deleting.');
					  }

					  fs.writeFile(critikatLocalJsonFileName, JSON.stringify(response), function (err) {
							if (err) return console.log(err);
							for (var index=0; index<response.length; index++){
										//console.log("IN... for (var index=0; index<lengthArray; index++){");
                    console.log(" ...    index == ", index);
                    console.log(" ...    response[index]['guid'] == ", response[index]['guid']);
                    console.log(" ...    response[index]['title'] == ", response[index]['title']);
                    console.log(" ...    response[index]['imageBig'] == ", response[index]['imageBig']);
                    console.log(" ...    response[index]['imageSmall'] == ", response[index]['imageSmall']);
										console.log(" ... ");
							}
							console.log('json a été écrit');
					  });

					});
		}, function(error) {
		  console.error("Failed!", error);
		});

  	console.log("AFTER calling... createImageKeyFromContentEncoded");

	})
}


setInterval(function(){
  //console.log('test');
  requestXmlFromCritikat();
}, CRITIKAT_RSS_FEED_MONITORING_PERIOD);



/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP || ip.address();
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || CRITIKAT_HOST_SERVER_PORT;
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'www/index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['www/index.html'] = fs.readFileSync('./www/index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           //console.log('%s: Received %s - terminating sample app ...', Date(Date.now()), sig);
           process.exit(1);
        }
        //console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

		self.app.use(express.static(__dirname));

    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express();
        self.app.use(cors());
        self.createRoutes();
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            //console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

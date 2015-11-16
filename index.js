var ws = require("nodejs-websocket");
var http = require("http");
var serveStatic = require('serve-static');
var _ = require("lodash");

var websocketServerPort = 4443;
var httpServerPort = 8080;

// Websockets
var currentWebsocketConnections = {};
var connectionIdIndex = 0;

ws.createServer(function(connection){
	var currentconnectionId = connectionIdIndex ++;
	currentWebsocketConnections[currentconnectionId] = connection;
	connection.on("text", function (str) {
		_.each(_.values(currentWebsocketConnections), function(storedConnection){
			storedConnection.sendText(str);
		});
	});
	connection.on("close", function(){
		delete currentWebsocketConnections[currentconnectionId];
	})
}).listen(websocketServerPort);


// Serving static files
var serve = serveStatic('static', {'index': ['index.html']});

// Create server
var server = http.createServer(function(req, res){
	serve(req, res, function(){});
})

// Listen
server.listen(httpServerPort)
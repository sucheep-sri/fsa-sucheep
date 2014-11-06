var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var server = new Hapi.Server(3000);

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'views')
});

server.route({
	method: 'GET',
	path: '/',
	handler: function(req, res){
		res.view('index', {title : 'Hapi'});
	}
});

server.pack.register(Good, function(err){
	if(err){
		throw err;
	}
	server.start(function(){
		console.log('Server runnung at : ', server.info.uri);
	});
});


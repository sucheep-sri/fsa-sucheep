var Hapi = require('hapi');
var Good = require('good');
var Path = require('path');
var Joi = require('joi');
var Bcrypt = require('bcrypt');
var Mongoose = require('mongoose');
var Users = require('./models/users');

var server = new Hapi.Server(3000);

Mongoose.connect('mongodb://localhost/test', function(err){
    if(err){
        console.log('DB connection error : '+ err);
    }
});

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, 'views')
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: Path.join(__dirname, 'public'),
            listing: true
        }
    }
});

server.route({
	method : 'GET',
	path : '/',
	handler: function(req, res){
		res.view('index', {title : 'Hapi'});
	}
});

server.route({
    method : 'GET',
    path : '/register',
    handler: function(req, res){
        res.view('register');
    }
});
server.route({
    method : 'GET',
    path : '/added',
    handler: function(req, res){
        res.view('added');
    }
});

server.route({
    method : 'POST',
    path : '/users',
    config : {
        handler : function(req, res){
            var user = {
                firstName : req.payload.firstName,
                lastName : req.payload.lastName,
                gender : req.payload.gender,
                email : req.payload.email,
                password : Bcrypt.hashSync(req.payload.password, 10),
                memberType : req.payload.memberType,
                description : req.payload.description,
                news : req.payload.news || 0,
                promotion : req.payload.promotion || 0
            };
            var usersObj = new Users(user);
            usersObj.save(function(err){
                console.log(usersObj);
                if(err) { res(err); console.log(err);}
                res.view('added', {user : usersObj});
            });
        },
        validate : {
            payload : {
                firstName : Joi.string().required(),
                lastName : Joi.string().required(),
                gender : Joi.number().integer(),
                email : Joi.string().required(),
                password : Joi.string().required(),
                confirmPassword : Joi.string().required(),
                memberType : Joi.string().required(),
                description : Joi.string().allow(''),
                news : Joi.number().integer(),
                promotion : Joi.number().integer()
            }
        }
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

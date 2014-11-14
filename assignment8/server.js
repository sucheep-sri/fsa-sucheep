var argv = require('optimist').argv;
var parser = require('xml2js').parseString;
var fs = require('fs');
var _ = require('lodash');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '',
});
connection.connect(function(err){
	if(err) console.log(err);
});

var xml = "./data/"+argv.file;
var block = argv.split;
var table = argv.table;
var database = argv.db;

connection.query('CREATE DATABASE IF NOT EXISTS ' + database + '', function(err, result){
	if(err) {throw err;}
	else
	{
		console.log('Create schema success, affectedrows = '+result.affectedRows);
		useDb();
	}
});

function useDb(){
	connection.query('USE '+database+'', function(err){
		if(err) {throw err;}
		else 
		{
			console.log('use database :'+database);
			readXml();
		}
	});	
}

function readXml(){
	fs.readFile(xml, function(err, data){
		if(err) console.log(err);
		else
		{
			parseXml(data);
		}
	});		
}

function parseXml(data){
	
	parser(data,{explicitArray : false}, function(err, result){
			var key = [];
			var obj = result.doc[block];
			_.each(obj, function(item){
				key = _.keys(item);
		});
		createTable(key, obj);							
	});
}
function createTable(keys, obj){
	var value = _.transform(keys, function(result, value){
		value += ' VARCHAR(255) ';
		return result.push(value);
	});
	connection.query('CREATE TABLE IF NOT EXISTS '+table+' ('+value+');', function(err){
		if(err) {throw err;}
		else 
			{
				console.log('Create table success');
				insertData(keys, obj);
			}
	});
}

function insertData(keys, obj){
	var data = _.map(obj, function(data){
		return _.flatten( _.values(_.pick(data, keys)));
	});
	for(var i in data)
	{
		connection.query('INSERT INTO '+table+' ('+keys+') VALUES (\''+data[i].join("','")+'\');', function(err, result){
			if(err) {throw err;}
			else
			{
				console.log('Create schema success, affectedrows = '+result.affectedRows);
			}
			
		});
	}
}

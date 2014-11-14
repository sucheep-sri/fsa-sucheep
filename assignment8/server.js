var stdio = require('stdio');
var parser = require('xml2js').parseString;
var fs = require('fs');
var _ = require('lodash');
var mysql = require('mysql');

var ops = stdio.getopt({
    'file': {key: 'f',description: 'input xml file', args: 1, mandatory: true},
    'split': {key: 's',description: 'input block to insertn mysql', args: 1, mandatory: true},
    'db': {key: 'd',description: 'input database name', args: 1, mandatory: true},
    'table': {key: 't',description: 'input table name', args: 1, mandatory: true}
});

var xml = "./data/"+ops.file;
var block = ops.split;
var table = ops.table;
var database = ops.db;

var connection = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '',
});
connection.connect(function(err){
	if(err) console.log(err);
});

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

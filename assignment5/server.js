var argv = require('minimist')(process.argv.slice(2));
var xml2js = require('xml2js');
var fs = require('fs');
var parser = new xml2js.Parser();

var xml = "./data/"+argv.f;
var json = "./data/"+argv.o;

fs.readFile(xml, function(err, data){
	parser.parseString(data, function(err, result){
		fs.writeFile(json, JSON.stringify(result), function(err, result){
			if(err) console.log(err);
			console.log("success !");
		});
	});
});

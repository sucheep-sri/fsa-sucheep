var fs = require('fs');
var async = require('async');

try
{
	async.waterfall([
		function readFile(callback){
			fs.readFile('./data/profile.txt', 'utf8', function(err, data){
				callback(err, data);
			});
		},
		function modify(text, callback){
			var replaceData = text.replace(/Bangkok/g, 'Phuket');
			callback(null, replaceData);
		},
		function writeFile(text, callback){
			fs.writeFile('./data/profile2.txt', text, function(err){
				callback(err, text);
			} );
		}
		],
		function(err, result){
		if(err) throw err;
		console.log(result);
	});
}
catch(err)
{
	console.log(err);
}
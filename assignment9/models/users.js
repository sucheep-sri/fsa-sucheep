var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema(
		{ 		
			firstName : {
				type : String, trim : true
			},
			lastName : {
				type : String, trim : true
			},
			gender : {
				type : Number, trim : true
			},
			email : {
				type : String, trim : true
			},
			password : {
				type : String, trim : true
			},
			description : {
				type : String, trim : true
			},			
			memberType : {
				type : Number
			},
			news : {
				type : Number
			},
			promotion : {
				type : Number
			}
		}
	);

module.exports = Mongoose.model('users', userSchema);

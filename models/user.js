var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	fs = require("fs");

mongoose.Promise = global.Promise;

var infoDataBase = fs.readFileSync("./helpers/config.desa.json","utf8", 
		function(error,data) {
			if (error) return null;
			else {
				var json = JSON.parse(data);
				var database = json["database"];
				if (database.name == "mongodb")
					return {
						instance: (database.instance != null && database.instance != undefined) ? database.instance : null,
						user : (database.user != null && database.user != undefined) ? database.user : null,
						pass : (database.pass != null && database.pass != undefined) ? database.pass : null
					}
				return null;
			}
});

if (infoDataBase != null) 
	mongoose.connect("mongodb://localserver:27017/expple",{user: infoDataBase.user, pass:infoDataBase.pass});
	else return;

//mongoose.connect("mongodb://localhost/expple"); //Nombre_del_servidor/nombre_bd
//mongoose.connect("mongodb://localserver:27017/expple");

/* 	Types mongodb
	String
	Number
	Date
	Buffer
	Boolean
	Mixed
	Objectid
	Array
*/

//var user_schema = new Schema({
//	name : String,
//	username : String,
//	password : String,
//	age : Number,
//	email : String,
//	date_of_birth : Date
//});

var posibles_valores = ["Masculino", "Femenino"];

var password_validation = {
	validator: function(p){
		return this.password_confirmation == p;
	},
	message: "Las contraseñas no son iguales"
}

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Coloca un email válido"];

var user_schema = new Schema({
	name : {type: String},
	last_name: String,
	username : {type: String, required: true, maxlength: [50, "Username demasiado largo"]},
	password : {
		type: String, 
		minlength: [5, "Contraseña demasiado corta"],
		validate: password_validation
	},
	age : {type: Number, min: [5,"Edad mínima"], max: [100, "Edad máxima"]},
	email : {type: String, required: "El correo es obligatorio", match: email_match},
	date_of_birth : Date,
	sex: {type: String, enum: {values: posibles_valores, message: "Opción no válida"}}
});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});

var User = mongoose.model("User", user_schema); //La collección que se crea en la bd tiene el nombre en plural

module.exports.User = User;
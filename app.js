var express = require("express"),
	bobyParser = require("body-parser"),
	User = require("./models/user").User,
	app = express(),
	//session = require("express-session"),
	cookieSession = require("cookie-session"),
	router_app = require("./route_app"),
	session_middleware = require("./middlewares/session");

//app.use("/static", express.static('public'));
app.use("/assets", express.static('assets'));
app.use("/public", express.static('public'));

app.use(bobyParser.json()); //application/json
app.use(bobyParser.urlencoded({extended: true}));

/*app.use(session({
	secret: "123asd12sf23",
	resave: false, //Especifica si la sesion tiene que volver a guardar aunque no haya sido modificada
	saveUninitialized: false //Si la session debe guardarse aunque no este inicializada
	/*genid: function(require) {} //Generar id unicos de session
}));*/

app.use(cookieSession({
	name: "session",
	keys: ["key-1","key-2"]
}));

app.set("view engine", "jade");

app.get("/", function(request, response) {
	console.log(request.session);
	response.render("index");
});

app.get("/signup", function(request, response) {	
	User.find(function(error, doc){		
		console.log(doc);
		response.render("signup");	
	});	
});

app.get("/login", function(request, response) {			
	response.render("login");
});

app.post("/sessions", function(request, response) {	

	//User.find({}, function(error,reg){});
	//User.findById(57f2d2c0219cd2b70e533f95, function(error,reg){});
	User.findOne( //Solo devuelve un documento
		{
			email: request.body.email,
			password: request.body.password
		},function (error, reg) {
			request.session.user_id = reg._id;
			console.log(reg);
			response.redirect("/app");

		})
});

app.post("/users", function(request, response){
	console.log("Email: " + request.body.email);
	console.log("Contraseña: " + request.body.password);
	console.log("Contraseña confirmacion: " + request.body.password_confirmation);
	var user = new User({
			email: request.body.email, 
			password: request.body.password,
			password_confirmation: request.body.password_confirmation,
			username: request.body.username
	});	

	//user.save(function(error, user, numero){
	//	if (error) {
	//		console.log(String(error));
	//	}
	//	response.send("Save your information");
	//});
	user.save().then( //Promises
		function(us) {
			response.send("Guardamos el usuario satisfactoriamente");
		}, 
		function (error) {
			if (error) {
				console.log(String(error));
				response.send("No se pudo guardar la información");
			}
		}
	);	
	//response.send("Recived your information");
});

app.use("/app", session_middleware);
app.use("/app", router_app);


app.listen(8080);
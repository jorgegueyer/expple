var express = require("express"),
	bobyParser = require("body-parser"),	
	app = express(),	
	session = require("express-session"),
	cookieSession = require("cookie-session"),	
	methodOverride = require("method-override"),
	expressFormidable = require("express-formidable"),
	http = require("http"),
	server = http.Server(app);	

app.use("/public", express.static('public'));

app.use(bobyParser.json()); //application/json
app.use(bobyParser.urlencoded({extended: true}));

app.use(methodOverride("_method"));

//para manejar la carpeta donde se guardan las imagenes
app.use(expressFormidable.parse({
	uploadDir: './tmp', // necesario para indicar la ruta de subida de archivos, en caso de que el proyecto se ejecute en un disco diferente al local
	keepExtensions : true
}));

app.use(cookieSession({
	name: "session",
	keys: ["key-1","key-2"]
}));

app.engine('jade', require('jade').__express);
app.set("view engine", "jade");

app.use("/app", require("./middlewares/session"));//First custom Middlewares
app.use(require('./controllers'));
server.listen(8080);
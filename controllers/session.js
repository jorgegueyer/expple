var express = require("express"),
	User = require("../models/user").User,	
	router  = express.Router();

router.get("/signup", function(request, response) {	
	User.find()
	.exec()
	.then(function(doc){		
			console.log(doc);
			response.render("signup");	
	})
	.catch(function(error){
			if(error)
				console.log(error);
	});	
});

router.get("/login", function(request, response) {			
	response.render("login");
});

router.post("/sessions", function(request, response) {	
	console.log("Controllers/Session - Line 23 - request.body.email -> " + request.body.email);
	console.log("Controllers/Session - Line 24 - request.body.password -> " + request.body.password);
	User.findOne(
			{
				email: request.body.email,
				password: request.body.password
			}
		)
		.exec()
		.then(function(reg){
				console.log(reg);			
				if (reg != null) {
					console.log(reg);
					request.session.user_id = reg._id;
					response.redirect("/app");
				}
				else {
					//TODO: Usuario no encontrado, devolver errror
					response.render("login");
				}			
		})
		.catch(function(error){
				if(error) {
					console.log(error);
				}
		});
});

module.exports = router;
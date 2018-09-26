var express = require("express"),
	User = require("../models/user"),	
	router  = express.Router();

router.post("/users", function(request, response){	
	var user = new User({
			email: request.body.email, 
			password: request.body.password,
			password_confirmation: request.body.password_confirmation,
			username: request.body.username
	});		
	user.save()
		.then(function(user) {
				response.send("Guardamos el usuario satisfactoriamente");
		})
		.catch(function(error) {
				if (error) {
					console.log(String(error));
					response.send("No se pudo guardar la información");
				}
		});
});

module.exports = router;
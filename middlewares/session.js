var User = require("../models/user").User;

module.exports = function (request, response, next) {
	if (!request.session.user_id) {
		response.redirect("/login");
	}
	else {		
		User.findById(request.session.user_id, function(error, reg){
			if (error){
				console.log(error);
			}
			else {
				console.log("reg: " + reg);
				response.locals = { user: reg };
				next();
			}
		});		
	}
}
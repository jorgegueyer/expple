var Imagen = require("../models/imagenes"),
	owner_check = require("./image_permission");

module.exports = function(request, response, next) {	
	Imagen.findById(request.params.id)
		.populate("creator")
		.exec()
		.then(function(imagen) {
			if (imagen != null && owner_check(imagen,request,response)) {
				console.log("Encontre la imagen:" + imagen.title);
				response.locals.imagen = imagen;
				next();
			}
			else {
				response.redirect("/app")
			}
		})
		.catch(function(error){
			console.log(error);
		})
}
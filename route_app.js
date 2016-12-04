var express = require("express"),
	Imagen = require("./models/imagenes"),
	router  = express.Router();


router.get("/", function (request, response){
	/* Buscar el usuario */
	response.render("app/home");
});

router.get("/imagenes/new",function(request,response){
	response.render("app/imagenes/new");
});

router.get("/imagenes/:id/edit",function(request,response){

});

/* REST */

router.route("/imagenes/:id")
	.get(function(request,response) {
		Imagen.findById(request.params.id,function(error,imagen){
			response.render("app/imagenes/show",{imagen:imagen});
		});
	})	
	.put(function(request,response){

	})
	.delete(function(request,response){

	});

router.route("/imagenes")
	.get(function(request,response){

	})
	.post(function(request,response) {
		var data = {
			title: request.body.title
		};

		var imagen = new Imagen(data);

		imagen.save(function(error){
			if (error) {
				response.render(error);
			} 
			else {
				response.redirect("/app/imagenes/" + imagen._id);
			}
		});
	})
	.put(function(request,response){

	});
	

module.exports = router;
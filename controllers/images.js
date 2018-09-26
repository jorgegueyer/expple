var express = require("express"),
	Imagen = require("../models/imagenes"),		
	fs = require("fs"),
	router  = express.Router();

router.get("/", function (request, response) {
	Imagen.find({creator: response.locals.user._id})	
		.populate('creator')
		.exec()		
		.then(function(imagenes){
			response.render("app/home", {imagenes: imagenes});	
		})
		.catch(function(error){
			if(error) console.log(error);
		});	
});

router.get("/imagenes/new",function(request,response){
	response.render("app/imagenes/new");
});

router.all("/imagenes/:id*", require("../middlewares/find_image"));

router.route("/imagenes/:id")
	.get(function(request,response) {		
			response.render("app/imagenes/show",{imagen:response.locals.imagen});	
	})	
	.put(function(request,response) {
		var imagen = response.locals.imagen;
		imagen.title = request.body.title;
		imagen.save()
			.then(function(img){
					if (img) 
						response.render("app/imagenes/show",{imagen: img});
			})
			.catch(function(error){
					if(error)
						response.render("app/imagenes/" + imagen.id + "/edit",{imagen: imagen});
			});		
	})
	.delete(function(request,response) {
		Imagen.findOneAndRemove({_id: request.params.id })
			.exec()
			.then(function(img){
					if(img)				
						response.redirect("/app/imagenes");
			})
			.catch(function(error){
					if (error) {
						console.log(error);
						response.redirect("/app/imagenes/" + request.params.id);
					}
			});
	});

router.get("/imagenes/:id/edit",function(request,response) {	
	response.render("app/imagenes/edit",{imagen:response.locals.imagen});
});

router.route("/imagenes")
	.get(function(request,response) {		
		Imagen.find({creator: response.locals.user._id})
			.exec()
			.then(function(imagenes){
				if (imagenes)
					response.render("app/imagenes/index", {imagenes: imagenes})
			})
			.catch(function(error){
				if (error) {
					response.redirect("/app");
					return;
				}
			});
	})
	.post(function(request,response) {	
		var extension = request.body.archivo.name.split(".").pop(); //pop() para obtener el último elemento del array
		var data = {
			title: request.body.title,
			creator: response.locals.user._id,
			extension: extension
		};

		var imagen = new Imagen(data);

		imagen.save()
			.then(function(img) {			
				var imgJSON = {
					"id": img._id,
					"title": img.title,
					"extension": img.extension
				};				
				//Mover el archivo
				fs.rename(request.body.archivo.path,"public/imagenes/" + img._id + "." + extension); 
				response.redirect("/app/imagenes/" + img._id);			
			})
			.catch(function(error){
				if (error) 
					response.render(error);
			});
	})
	.put(function(request,response) { });

module.exports = router;
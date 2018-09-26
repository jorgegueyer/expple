var socket = io();
socket.on("newimage", function(data){
	data = JSON.parse(data);
	var container = document.querySelector("#imagenes");
	var source = document.querySelector("#image-template").innerHTML;
	var template = Handlebars.compile(source);
	container.innerHTML = template(data) + container.innerHTML;
	//container.innerHTML += template(data);
});
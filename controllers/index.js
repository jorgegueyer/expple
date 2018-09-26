var express = require("express"),
	User = require("../models/user").User,		
	router  = express.Router();

router.get("/", function(request, response) {
	console.log(request.session);
	response.render("index");
});

router.use(require('./session'));
router.use(require('./user'));
router.use('/app', require('./images'));

module.exports = router;
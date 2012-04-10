var server = require("express").createServer(),
    parser = require("parameter-descriptors"),
    url    = require("url"),
    path   = require("path"),
    fs     = require("fs");


/*
 * Load the file in as text and set it as the property
 * req.source
 */
server.use(function(req,res,next){
	if(req.method !== 'GET') next();
	else{
		var filePath = "./samples" + url.parse(req.url).pathname;
		path.exists(filePath, function(exists){
			if(exists){
				fs.readFile(filePath, function(err, data){
					if(err) next(err);
					else {
						req.source = data.toString();
						next();
					}
				});
			} else {
				res.send("Could not find requested content", 404);
			}
		});
	}
});


server.use(function(req, res, next){
	if(!req.source) next();
	else if (req.parsed) next();
	else{
		req.parsed = parser.parse(JSON.parse(req.source));
		next();
	}
});



/*
 * Use one single method to render all outputs
 */
server.use(function(req,res,next){
	if(req.parsed) res.send(parser.render(req.parsed));
	else res.send("Could not find requested content", 404);
});

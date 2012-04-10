var server = require("express").createServer(),
    parser = require("./index.js"),
    url    = require("url"),
    path   = require("path"),
    fs     = require("fs");

server.set('views', __dirname);
server.set('view options', {
	layout:false
});

server.get("/style.css", function(req,res,next){
	res.sendfile('./default-styles.css',function(err){
		console.log(err);
	});
});
server.use(server.router);
/*
 * Load the file in as text and set it as the property
 * req.source
 */
server.use(function(req,res,next){
	if(req.method !== 'GET') res.send(req.method + " is not supported", 500);
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
				res.send("File path "+filePath+" does not exist", 404);
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
	if(req.parsed) res.render("server.ejs", {output:parser.render(req.parsed)});
	else res.send("Could not find requested content", 404);
});

server.listen(process.env.PORT || 8080);
console.log("server listening on "+(process.env.PORT||8080));

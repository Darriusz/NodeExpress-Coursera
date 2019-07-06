const express = require('express');
const http = require('http');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require ('body-parser');
const dishRouter = require('./routes/dishRouter');

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev')); //daje na konsoli inf o komunikacji z serwerem
app.use(bodyParser.json());

app.use('/dishes', dishRouter); //requests coming to /dishes will be handled by dishRouter


//*** REST Representational State Transfer *************************


app.get('/dishes/:dishId', (req, res, next) => {
	res.end('When integrated with MongoDB it will give details of the dish:' + req.params.dishId + ' to you');
});

app.post('/dishes/:dishId/', (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing dishes');
});

app.put('/dishes/:dishId', (req, res, next) => {
	res.write('Updating the dish: ' + req.params.dishId + "\n");
	res.end('When integrated with MongoDB it will update the dish: ' + req.body.name + 
		' with details ' + req.body.description);
});

app.delete('/dishes/:dishId', (req, res, next) => {
	res.end('When integrated with MongoDB it will delete dish: ' + req.params.dishId);
});

//*************end of REST *****************

app.use(express.static(__dirname + '/pub'));

app.use((req, res, next) => {

	var fileUrl = req.url;
	if (fileUrl == '/wazneDane.html'){
		res.statusCode = 403;
		res.setHeader('Content-Type', 'text/html');
		res.end('<html><body><h1>Error 403: for ' + fileUrl + ' access forbidden</h1></body></html>');
		return;			
	}

	var filePath = path.resolve('./pub'+fileUrl);
	const fileExt = path.extname(filePath);
	if (fileExt=='.html') {
		fs.exists(filePath, (exists) => {
			if (!exists) {
				res.statusCode = 404;
				res.setHeader('Content-Type', 'text/html');
				res.end('<html><body><h1>Error 404: ' + fileUrl + ' not found</h1></body></html>');
				return;
			}

		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html')
		res.end('<html><body><h1>hello, this is an Express server!</h1></body></html>');
		}); 
	}
	else {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/html');
	res.end('<html><body><h1>Error 404: ' + fileExt + ' files not supported</h1></body></html>');
	return;			
	}

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);
})
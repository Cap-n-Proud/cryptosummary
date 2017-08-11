 var options = {
    root: __dirname + '/public',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

module.exports = function(app){

   app.get('/foundation', function(req, res){
 	 res.sendFile('foundation/index.html', options);
 	 res.end;
	}); 

   app.get('/', function(req, res){
 	 res.sendFile('index.html', options);
 	 res.end;
	}); 
 app.get('/test', function(req, res){
 	 res.sendFile('test.html', options);
 	 res.end;
	}); 

//other routes..
}

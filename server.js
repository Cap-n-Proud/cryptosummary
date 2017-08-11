var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var express = require('express'),
    app = module.exports.app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server); //pass a http.Server instance
var request = require('request');

require('./routes')(app);

var addresses = require("./addresses.json");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/foundation', express.static(path.join(__dirname, 'public/foundation')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var ETH = {
    currency: 'Ξ',
    message: 'Hello World!',
    balance: 'N/A',
    address: 'N/A',
    ucost: 'N/A',
    address: 'N/A',
    time: new Date().toJSON()
}

function ETHData() {
    for (var i = 0; i < addresses.ETH.length; i++) {
        //    console.log(addresses.ETH[i]);

        var url = "https://api.etherscan.io/api?module=account&action=balance&address=" + addresses.ETH[i] +"&tag=latest&apikey=YourApiKeyToken";
        request(url, ETH, function(error, response, body) {
            // Check the results of the HTTP call
            if (!error && response.statusCode == 200) {
                // Parse the JSON results
                var result = JSON.parse(body);
                ETH.balance = result.result/1000000000000000000;
coinmarketcapParse('eth', 'price.chf', function(response) {
                	ETH.ucost = response.toFixed(3);
		//console.log(ETH.ucost);
                });
		ETH.time = new Date().toJSON();
                io.emit('ETH', ETH);

            } else {
                // handle the error
                console.log("Unable to find address");
                if (error) console.log("ERROR:", error);
            }
        });

    }


}

        var XBT = {
            currency: '฿',
            message: 'Hello World!',
            balance: 'N/A',
            address: 'N/A',
            ucost: 'N/A',
            address: 'N/A',
            time: new Date().toJSON()
        }
function XBTData() {


    for (var i = 0; i < addresses.XBT.length; i++) {
       // console.log(addresses.XBT[i]);

        var url = "https://blockchain.info/address/" + addresses.XBT[i] + "?format=json";
 request(url, XBT, function(error, response, body) {
            // Check the results of the HTTP call
            if (!error && response.statusCode == 200) {
                // Parse the JSON results
                var result = JSON.parse(body);
                XBT.balance = result.final_balance/100000000;
coinmarketcapParse('btc', 'price.chf', function(response) {
                	XBT.ucost = response.toFixed(3);
		//console.log(ETH.ucost);
                });
		XBT.time = new Date().toJSON();
                io.emit('XBT', XBT);

            } else {
                // handle the error
                console.log("Unable to find address");
                if (error) console.log("ERROR:", error);
            }
        });

    }


}


function coinmarketcapParse(currency, variable, callback) {

    var url = "https://coinmarketcap-nexuist.rhcloud.com/api/" + currency;
    var xchange = 0;
    request(url, function(error, response, body) {
        // Check the results of the HTTP call
        if (!error && response.statusCode == 200) {
            // Parse the JSON results
            var result = JSON.parse(body);
            // Display the results to the console
            // The results are in 'satoshis' and need to be converted to BTC
            //console.log('1 ETH =: ' + result.price.chf + 'CHF');
            xchange = result.price.chf;
            callback(xchange)
        } else {
            // handle the error
            console.log("Unable to find address");
            if (error) console.log("ERROR:", error);
        }
    });
}

/*
function dummy(i, callback) {
	setTimeout(function() {
		// After 1 second, we callback with a result
    	callback('dumb result')
    }, 1000);
}
*/
// Correct version
/*for (var i = 0; i < 10; i++) {
	dummy(i, function(response) {
		console.log("i = " + this.i + " , response = " + response);
	}.bind( {i: i} ))
}
*/

/*function coinmarketcapParse(currency,variable) {
 


 var obj = JSON.parse( UrlFetchApp.fetch("https://coinmarketcap-nexuist.rhcloud.com/api/"+currency));
  return eval("obj."+variable);
}
*/

//console.log(coinmarketcapParse("eth", "price.btc", coinmarketcapParse));





// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', {
        message: 'Welcome!',
        id: socket.id
    });

    socket.on('i am client', console.log);
 socket.on('update', function (data) {
	ETHData();
	XBTData();
    //console.log(data);
  });

});

server.listen(3000); //listen on port 80

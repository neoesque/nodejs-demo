
/**
 * Module dependencies.
 */
require.paths.unshift('./node_modules');
var connect = require('connect'),
    express = require('express');

// use array as simple db XD
var db = [];

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + '/public', compress : true}));
    app.use(express.compiler({src: __dirname + '/public', enable: ['coffeescript']}));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    var articles = {};
    for (var i=0, item; item = db[i++];) {
        articles[item.id] = item.content;
    }
    res.render('index', {
        title: 'Hello Cloud Foundry',
        articles: articles
    });
});

app.post('/delete', function(req, res){
    var id = req.body.id;
    for (var i=0, item; item = db[i++];) {
        if (item.id === id) {
            db.splice(i-1, 1);
            break;
        }
    }
    res.send(200);
});

app.post('/save', function(req, res){
    var content = req.body.content;
    var id = req.body.id || connect.utils.md5(new Date().getTime().toString());
    if(req.body.id){
        for (var i=0, item; item = db[i++];) {
            if (item.id === req.body.id) {
                db[i-1] = { id : id, content : req.body.content};
                break;
            }
        }
    }else{
        db.unshift( { id : id, content : content } );
    }
    res.render('save', {
        id : id ,
        content : content ,
        layout : false
    });
});

// Only listen on $ node app.js

if (!module.parent) {
    app.listen(process.env.VMC_APP_PORT||3000);
    console.log("Express server listening on port %d", app.address().port);
}


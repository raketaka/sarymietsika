//datalayer
var datalayer = require('./datalayer_user.js');


const express = require('express');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');

app.use(bodyParser.json());                             // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));       // to support URL-encoded bodies

app.use(express.static(__dirname + '/public'));

var cors = require('cors')

app.use(cors());

datalayer.init(function(){
    console.log('init');
    app.listen(process.env.PORT || port);
    console.log("Listening on port " + port);
});

app.get('/', function(req,res){
	res.sendFile('./public/signin.html', {root: __dirname});
});

// app.get('/accueil', function(req,res){
// 	res.sendFile('./public/accueil/accueil.html', {root: __dirname});
// });


/* ================ USERS ================ */

//Send all users
app.get("/getUserSet", function(req,res){
    datalayer.getUserSet(function(dtSet){
        res.send(dtSet);
    });
});

//Create User
app.post("/createUser", function(req,res) {
    var user = {
        pseudo : req.body.pseudo,
        mdp : req.body.mdp
    };
    datalayer.createUser (user, function() {
        datalayer.getUserSet(function(dtSet){
            res.send(dtSet);
        });
    });
});

//Login
app.post("/login", function(req,res) {
    var user = {
        pseudo : req.body.pseudo,
        mdp : req.body.mdp
    };
    datalayer.getUser(user, function(result) {
        if (result == null){
            console.log("Echec connexion");
        }
        else {
            console.log("Connexion OK");
        }
        res.send(result);
    });
});
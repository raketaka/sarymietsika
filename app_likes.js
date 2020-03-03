//datalayer
var datalayer = require('./datalayer_likes.js');


const express = require('express');
const app = express();
const port = 3002;
var bodyParser = require('body-parser');

app.use(bodyParser.json());                             // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));       // to support URL-encoded bodies

app.use(express.static(__dirname + '/public/accueil'));

var cors = require('cors')

app.use(cors());

datalayer.init(function(){
    console.log('init');
    app.listen(process.env.PORT || port);
    console.log("Listening on port " + port);
});

app.get('/likes', function(req,res){
	res.sendFile('./public/accueil/likes.html', {root: __dirname});
});

app.get('/search', function(req,res){
	res.sendFile('./public/accueil/accueil.html', {root: __dirname});
});

app.get('/playlist', function(req,res){
	res.sendFile('./public/accueil/playlist.html', {root: __dirname});
});

//Send all user's likes
app.get("/getUserLikes/:pseudo", function(req,res){
    var pseudo = req.params.pseudo;
    datalayer.getUserLikes(pseudo,function(dtSet){
        res.send(dtSet);
    });
});

//Send all likes
app.get("/getLikesSet", function(req,res){
    datalayer.getLikesSet(function(dtSet){
        res.send(dtSet);
    });
});

//Add Like to a video
app.post("/addToLikes/:pseudo/:videoId", function(req,res) {
    var like = {
        pseudo : req.params.pseudo,
        videoId : req.params.videoId,
        title : req.body.infos.title,
        author : req.body.infos.author.name,
        views : req.body.infos.views,
        ago : req.body.infos.ago,
        timestamp : req.body.infos.timestamp,
        thumbnail : req.body.thumbnail
    };
    datalayer.addLike(like, function() {
        // datalayer.getLikesSet(function(dtSet){
        //     res.send(dtSet);
        // });
    });
});


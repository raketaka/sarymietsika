//datalayer
var datalayer = require('./datalayer_recherche.js');


const express = require('express');
const app = express();
const port = 3001;
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

app.get('/accueil', function(req,res){
	res.sendFile('./public/accueil/accueil.html', {root: __dirname});
});

app.get('/play', function(req,res){
	res.sendFile('./public/accueil/play.html', {root: __dirname});
});

app.get('/likes', function(req,res){
	res.sendFile('./public/accueil/likes.html', {root: __dirname});
});

app.get('/playlist', function(req,res){
	res.sendFile('./public/accueil/playlist.html', {root: __dirname});
});

//Search
app.post("/search", function(req,res){
    var recherche = {
        keyword : req.body.keyword,
    };
    datalayer.search(recherche,function(dtSet){
        res.send(dtSet);
    });
});

app.post("/play/:id", function(req,res){
    var videoId = {
        id : req.params.id,
    };
    // console.log(videoId)
    datalayer.play(videoId,function(dtSet){
        res.send(dtSet);
    });
});

// //Add Like to a video
// app.post("/addToLikes/:pseudo/:videoId", function(req,res) {
//     var like = {
//         pseudo : req.params.pseudo,
//         videoId : req.params.videoId,
//         title : req.body.infos.title,
//         author : req.body.infos.author.name,
//         views : req.body.infos.views,
//         ago : req.body.infos.ago,
//         timestamp : req.body.infos.timestamp,
//         thumbnail : req.body.thumbnail
//     };
//     datalayer.addLike(like, function() {
//         // datalayer.getLikesSet(function(dtSet){
//         //     res.send(dtSet);
//         // });
//     });
// });
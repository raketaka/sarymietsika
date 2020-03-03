
//datalayer
var datalayer = require('./datalayer_playlist.js');
// const youtubedl = require('youtube-dl');
const express = require('express');
const app = express();
const port = 3003;
var bodyParser = require('body-parser');

app.use(bodyParser.json());                             // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));       // to support URL-encoded bodies

app.use(express.static(__dirname + '/public/accueil'));

var cors = require('cors')

app.use(cors());


datalayer.init(function(){
    console.log('init');
    app.listen(port);
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

app.get('/videos_playlist', function(req,res){
	res.sendFile('./public/accueil/videos_playlist.html', {root: __dirname});
});


//Send all tasks
app.get("/getPlaylistSet", function(req,res){
    datalayer.getPlaylistSet(function(dtSet){
        res.send(dtSet);
    });
});

//Send all user's playlist
app.get("/getUserPlaylists/:pseudo", function(req,res){
    var pseudo = req.params.pseudo;
    datalayer.getUserPlaylists(pseudo,function(dtSet){
        res.send(dtSet);
    });
});

//Send all videos from playlist
app.get("/getVideos/:playlist_id", function(req,res){
    var id = req.params.playlist_id;
    datalayer.getVideos(id,function(dtSet){
        res.send(dtSet);
    });
});


//marche mais on n'a pas besoin de créer cette méthode
app.post("/getOnePlaylist", function(req,res){
    var id = req.body.id;
    datalayer.getOnePlaylist(id,function(data){
        res.send(data);
    });
});

//create a new Playlist
app.post("/createPlaylist/:pseudo",function(req,res){
    var playlist={
        pseudo : req.params.pseudo,
        titre : req.body.titre,
        listeVideo : []
    }
    datalayer.createPlaylist(playlist, function(dtSet){
        datalayer.getPlaylistSet(function(dtSet){
            res.send(dtSet);
        });
    })
});


//add a new vid to an existing playlist
app.put("/addToPlaylist/:playlist_id", function(req,res){
    var id = req.params.playlist_id;    
    var data = req.body;
    datalayer.getOnePlaylist(id,function(playlist){
        playlist.listeVideo.push(data);
        datalayer.modifyPlaylist(id,playlist,function(){
            datalayer.getPlaylistSet(function(dtSet){
                res.send(dtSet);
            });
        });
    });
});

//remove a video from a playlist
app.put("/removeToPlaylist/:playlist_id", function(req,res){
    var id = req.params.playlist_id;
    var name = req.body.name;
    datalayer.getOnePlaylist(id,function(playlist){
        var idx = playlist.listeVideo.indexOf(name); //donne l'index de l'élément en paramètre sinon renvoie la valeur -1 si l'élément n'existe pas
        if(idx>=0){ 
            playlist.listeVideo.splice(idx,1);          //on enlève 1 élément à partir de l'indexe qui nous intéresse
        } ; 
        datalayer.modifyPlaylist(id,playlist,function(){
            datalayer.getPlaylistSet(function(dtSet){
                res.send(dtSet);
            });
        });
    });
});

//delete a playlist 
app.delete("/deletePlaylist/:playlist_id", function(req, res) {
    var id = req.params.playlist_id;
    datalayer.deletePlaylist(id,function(){
        datalayer.getPlaylistSet(function(dtSet){
            res.send(dtSet);
        });
    });
 });
var express = require('express');
var app = express();
var http_scrape=require('./http_module')
var twitter_search = require('./twitter_track')
var noodle = require('./scrap.js');

app.use(express.static(__dirname + '/'));
var server = app.listen(5050, function () {
  var host = server.address().address
  var port = server.address().port
//
  console.log("The Bot app is listening at http://%s:%s", host, port)
});

app.get('/youtube/:query', function(req, res) {
  var query = req.params.query;
  console.log(query);
  http_scrape.scrape_ytube(query, function(result) {
    return res.send(result);
  });
});

app.get('/twitter/:query', function(req, res) {
  var query = req.params.query;
  console.log(query);
  twitter_search.twitter_search(query, function(result) {
    return res.send(result);
  });
});

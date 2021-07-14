var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')
const db = require('../database/db')


router.get('/', function(req, res, next) {
  var projects = db.get('projects')
  projects.find({},{},function(err,project){
    res.render('index',{projects:project})
  })
});

router.get('/about', function(req, res, next) {
 res.render('about')
});

router.get('/details/:id', function(req, res, next) {
  var projects = db.get('projects')
  projects.find(req.params.id,{},function(err,project){
    res.render('details',{projects:project})
  })
});

module.exports = router;

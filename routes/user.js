var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')
var db = require('monk')('localhost:27017/ProjectDB')
var passport = require('passport')



router.get('/', function(req, res, next) {
    res.render('welcome')
});


module.exports = router;
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')
const db = require('../database/db')
var passport = require('passport')



router.get('/', function(req, res, next) {
    res.render('welcome')
});


module.exports = router;
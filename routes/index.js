var express = require('express');
var router = express.Router();
var fs = require('fs');
var contents = fs.readFileSync('./public/javascripts/data.json');
var jsonContents = JSON.parse(contents);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { jsondata: jsonContents});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const sanitizeHTML = require('sanitize-html');
const db = require('./db').db().collection('items');
const mongodb = require('mongodb');

router.get('/', function (req, res) {
	db.find().toArray(function (err, items) {
		req.session.items = items;
		req.session.save(function(){
			res.render('index',{items: req.session.items});
		});
	});
});

router.post('/create-item', function (req, res) {
	let safeText = sanitizeHTML(req.body.text, {
		allowedTags: [],
		allowedAttributes: {},
	});
	db.insertOne({ text: safeText }, function (err, info) {
		res.json(info.ops[0]);
	});
});

router.post('/update-item', function (req, res) {
	let safeText = sanitizeHTML(req.body.text, {
		allowedTags: [],
		allowedAttributes: {},
	});

	db.findOneAndUpdate(
		{ _id: new mongodb.ObjectId(req.body.id) },
		{ $set: { text: safeText } },
		function () {
			// res.redirect('/');
			res.send('Success');
		}
	);
});

router.post('/delete-item', function (req, res) {
	db.deleteOne(
		{ _id: new mongodb.ObjectId(req.body.id) },
		function () {
			res.send('Success');
		}
	);
});

module.exports = router;
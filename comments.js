// Create web server with Node.js

// Import modules
var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var path = require('path');
var mime = require('mime');
var crypto = require('crypto');
var session = require('cookie-session');

// Import user defined modules
var db = require('./db');
var config = require('./config');

// Create web server
http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
        // Parse a file upload
        var form = new formidable.IncomingForm();
        form.uploadDir = config.uploadDir;
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                return;
            }
            var oldpath = files.file.path;
            var newpath = config.uploadDir + files.file.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else if (req.url == '/upload' && req.method.toLowerCase() == 'get') {
        // Display a file upload form
        fs.readFile('./upload.html', function (err, data) {
            if (err) {
                console.error(err);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else if (req.url == '/comments' && req.method.toLowerCase() == 'post') {
        // Save a comment
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error(err);
                return;
            }
            var comment = {
                name: fields.name,
                email: fields.email,
                comment: fields.comment
            };
            db.saveComment(comment, function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { 'Location': '/comments' });
                res.end();
            });
        });
    } else if (req.url == '/comments' && req.method.toLowerCase() == 'get') { 
        // Display comments
        db.getAllComments(function (err, comments) {
            if (err) {
                console.error(err);
                return;
            }
            fs.readFile('./comments.html', function (err, data) {
                if (err) {
                    console.error(err);
                    return;
                }
                var template = data.toString();
                var html = template.replace('#comments#', JSON.stringify(comments));
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(html);
                res.end();
            });
        });
    }
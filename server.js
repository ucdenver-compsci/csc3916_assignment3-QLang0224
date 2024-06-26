/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        key: process.env.SECRET_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}
router.post('/movies', verifyToken, (req, res) => {
router.post('/movies', (req, res) => {
    // Check if request body contains required fields
    if (!req.body.title || !req.body.releaseDate || !req.body.genre || !req.body.actors) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
     const newMovie = new Movie({
        title: req.body.title,
        releaseDate: req.body.releaseDate,
        genre: req.body.genre,
        actors: req.body.actors
    });

        newMovie.save()
            .then(movie => {
                res.status(201).json({ success: true, message: 'Movie created successfully.', movie });
            })
            .catch(error => {
                res.status(500).json({ success: false, message: 'Failed to create movie.', error });
            });
        });
    });
router.get('/movies', verifyToken, (req, res) => {
   Movie.find()
        .then(movies => {
            res.status(200).json({ success: true, movies });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Failed to retrieve movies.', error });
        });
});

router.get('/movies', verifyToken, (req, res) => {
router.get('/movies/:id', (req, res) => {
    Movie.findById(req.params.id)
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found.' });
            }
            res.status(200).json({ success: true, movie });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Failed to retrieve movie.', error });
        });
    });
});

router.put('/movies', verifyToken, (req, res) => {
router.put('/movies/:id', (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found.' });
            }
            res.status(200).json({ success: true, message: 'Movie updated successfully.', movie });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Failed to update movie.', error });
        });
    });
});
router.delete('/movies', verifyToken, (req, res) => {
router.delete('/movies/:id', (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
        .then(movie => {
            if (!movie) {
                return res.status(404).json({ success: false, message: 'Movie not found.' });
            }
            res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Failed to delete movie.', error });
        });
    });
});

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
            });
        }
    });

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
                }
            })
        })
    });

function verifyToken(req, res, next) {
    var token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ success: false, msg: 'No token provided.' });
    }
    jwt.verify(token.split(' ')[1], JWT_SECRET_KEY, function(err, decoded) {
        if (err) {
            return res.status(500).json({ success: false, msg: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        next();
    });
}

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only



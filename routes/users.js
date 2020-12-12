var express = require("express");
var router = express.Router();
//var User = require("../models/User.js");
let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000 ; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h 
/*const mongoose = require('mongoose');
const Note = require('../models/note.js');
const UserMongo = require('../models/UsersMongo.js');*/
var RealUser = require("../models/RealUser.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;

/* GET user list : secure the route with JWT authorization */
/*router.get("/", authorize, function (req, res, next) {
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note);
    });
    mongoose.connection.close();
  });
  return res.json(User.list);
});*/

/* POST user data for authentication */
/*router.post("/login", function (req, res, next) {
  let user = new User(req.body.email, req.body.email, req.body.password);
  console.log("POST users/login:", User.list);
  user.checkCredentials(req.body.email, req.body.password).then((match) => {
    if (match) {
      jwt.sign({ username: user.username , isAdmin: user.isAdmin }, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST users/ token:", token);
        return res.json({ username: user.username, isAdmin: user.isAdmin, token });
      });
    } else {
      console.log("POST users/login Error:", "Unauthentified");
      return res.status(401).send("bad email/password");
    }
  })  
});*/

/* POST a new user */
/*router.post("/", function (req, res, next) {
  //console.log("POST users/", User.list);
  //console.log("email:", req.body.email);
  if (User.isUser(req.body.email))
    return res.status(409).end();
  let newUser = new User(req.body.email, req.body.email, req.body.password);
  newUser.save().then(() => {
    //console.log("afterRegisterOp:", User.list);
    jwt.sign({ username: newUser.username, isAdmin: newUser.isAdmin}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
      if (err) {
        console.error("POST users/ :", err);
        return res.status(500).send(err.message);
      }
      //console.log("POST users/ token:", token);
      return res.json({ username: newUser.username, isAdmin: newUser.isAdmin, token });
    });
  });
});*/

/* GET user object from username */
/*router.get("/:username", function (req, res, next) {
  console.log("GET users/:username", req.params.username);
  const userFound = User.getUserFromList(req.params.username);
  if (userFound) {
    return res.json(userFound);
  } else {
    return res.status(404).send("ressource not found");
  }
});*/

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
  RealUser.list().then((data) => {
    console.log("POST users/login:", data);
    return res.json(data);
  }).catch((err) => { console.log(err); });
});

/* POST user data for authentication */
router.post("/login", function (req, res, next) {
  RealUser.list().then((data) => {
    console.log("POST users/login:", data);
    let newUser = new RealUser(req.body.email, req.body.email, req.body.password);
    newUser.checkCredentials(req.body.email, req.body.password).then((match) => {
      console.log("match", match);
      if(match){
        console.log("New User :", newUser);
        jwt.sign({ username: newUser.email, isAdmin: newUser.isAdmin}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
          if (err) {
            console.error("POST users/ :", err);
            return res.status(500).send(err.message);
          }
          return res.json({ username: newUser.username, isAdmin: newUser.isAdmin, token });
        });
      }else{
        console.log("POST users/login Error:", "Unauthentified");
        return res.status(401).send("bad email/password");
      }
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });
});

/* POST a new user *//* Register */
router.post("/", (req, res, next) => {
  RealUser.isUser(req.body.email).then((data) => {
    //console.log(data);
    if(data) return res.status(409).send();
    console.log("as continué After",data);
    let newUser = new RealUser(req.body.email, req.body.email, req.body.password);
    //console.log("NewUser", newUser);
    newUser.save().then((data) => {
      console.log("creation jwt :", data);
      jwt.sign({ username: newUser.email, isAdmin: newUser.isAdmin}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        return res.json({ username: newUser.username, isAdmin: newUser.isAdmin, token });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  });
});

/* GET user object from username */
router.get("/:username", function (req, res, next) {
  /*console.log("GET users/:username", req.params.username);
  const userFound = User.getUserFromList(req.params.username);
  if (userFound) {
    return res.json(userFound);
  } else {
    return res.status(404).send("ressource not found");
  }*/
  console.log("GET users/:username", req.params.username);
  let userFound = RealUser.getUserByUsername(req.params.username).then((userFound) => {
    console.log(userFound);
    if(userFound){
      return res.json(userFound);
    } else {
      return res.status(404).send("ressource not found");
    }
  }).catch((err) => { console.log(err); });
});

module.exports = router;

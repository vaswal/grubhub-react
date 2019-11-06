var express = require('express');
const mysql = require('mysql');
var router = express.Router();
const pool = require("../DbConnection");
const uuid = require("uuid");
const passport = require('passport');
const mongoose = require('mongoose');
const auth = require('./Auth');
require('../models/Buyer');
require('../models/Owner');
var kafka = require('./kafka/client');

const Buyer = mongoose.model('Buyer');
const Owner = mongoose.model('Owner');

router.post('/savemongo', auth.optional, (req, res, next) => {
    console.log("save req");
    console.log(req.body);

    kafka.make_request('access', {"path": "signup", "body": req.body}, function (err, result) {
        console.log('in result');
        console.log(result);
        if (err) {
            res.send({
                signupSuccess: false,
                signupMessage: "Sign In Failed"
            })
        } else {
            res.send({
                signupSuccess: true,
                signupMessage: "Successful SignUp"
            });
        }
    });

    // const {body: {user}} = req;
    //
    // console.log("save user");
    // console.log(user);
    //
    // const finalUser = ("buyer" === user.userType ? new Buyer(user) : new Owner(user));
    //
    // finalUser.setPassword(user.password);
    // finalUser.userType = user.userType;
    //
    // console.log("finalUser");
    // console.log(finalUser.toAuthJSON());
    //
    // return finalUser.save()
    //     .then(() => res.json(finalUser.toAuthJSON()));
});

//Iter 3
router.post('/loginpassport', auth.optional, function (req, res) {
    console.log("loginpassport req");
    console.log(req.body);

    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        console.log("Inside");
        console.log("passportUser");
        console.log(passportUser);

        if (err) {
            console.log("Error;");
            res.send('Error')
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();
            user.userType = req.body.userType;

            console.log("user");
            console.log(user);

            console.log("user.toAuthJSON()");
            console.log(user.toAuthJSON());

            return res.send({
                signinSuccess: true,
                signinMessage: "Successful Login",
                user: user.toAuthJSON()
            });
        }

        return res.send('Error');
    })(req, res);
});

//Iter 3
router.post('/loginkafka', auth.optional, function (req, res) {
    console.log("loginkafka req");
    console.log(req.body);

    kafka.make_request('access', {"path": "signin", "body": req.body}, function (err, result) {
        console.log('in result');
        console.log(result);
        if (err) {
            res.send({
                signinSuccess: false,
                signinMessage: "Sign In Failed"
            })
        } else {
            res.send(result);
        }
    });
});


//Route to handle Post Request Call
router.post('/login', function (req, res) {
    console.log("Inside Login Post Request");
    let body = {
        email: req.body.emailId,
        password: req.body.password,
        userType: req.body.userType
    };
    console.log("userType: " + body.userType);

    pool.query(`SELECT id FROM ${body.userType} where email=? and password=?`, [body.email, body.password], (err, result) => {
        if (err) {
            console.log(err);
            res.send({
                signinSuccess: false,
                signinMessage: "SignUp Failed",
            })
        } else {
            console.log('Result: ' + JSON.stringify(result));
            const length = result.length;

            if (length > 0) {
                const data = {
                    userType: body.userType,
                    userId: result[0].id
                };

                //res.cookie('cookie', JSON.stringify(data), {maxAge: 900000, httpOnly: false, path : '/'});
                //res.cookie('cookie',"buyer", {id:"some"},{maxAge: 900000, httpOnly: false, path : '/'});
                res.send({
                    signinSuccess: true,
                    signinMessage: "Successful Login",
                    userId: result[0].id,
                    userType: body.userType
                })
            } else {
                res.send({
                    signinSuccess: false,
                    signinMessage: "Email id or password does not match"
                })
            }
        }
    });
});

router.get('/test', function (req, res) {
    res.send("hello");
});


router.post('/create', function (req, res) {
    console.log("Inside createBook");
    console.log("createBook ", req.body);

    let body = {
        id: uuid(),
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.emailId,
        password: req.body.password
    };
    console.log("Inside Backend Account.js", body);

    pool.query(`SELECT COUNT (*) FROM buyer where email=?`, [body.email], (err, result) => {
        if (err) {
            console.log(err);
            res.send({
                signupSuccess: false,
                signupMessage: "SignUp Failed"
            })
        } else {
            console.log('Result: ' + JSON.stringify(result));
            const count = result[0].count;

            if (count > 0) {
                res.send({
                    signupSuccess: false,
                    signupMessage: "Email id already exists"
                })
            }
        }
    });

    pool.query('INSERT INTO buyer SET ?', body, (err, result) => {
        if (err) {
            console.log(err);
            res.send({
                signupSuccess: false,
                signupMessage: "SignUp Failed"
            })
        } else {
            console.log('Inserted ' + body);
            res.send({
                signupSuccess: true,
                signupMessage: "Successful SignUp"
            })
        }
    });
});

router.post('/createOwner', function (req, res) {
    console.log("Inside createBook");
    console.log("createBook ", req.body);

    let body = {
        id: uuid(),
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.emailId,
        password: req.body.password,
        phonenumber: req.body.phoneNumber,
        restaurantname: req.body.restaurantName,
        cuisine: req.body.cuisine
    };
    console.log("Inside createOwner", body);

    pool.query(`SELECT COUNT (*) as count FROM owner where email=?`, [body.email], (err, result) => {
        if (err) {
            console.log(err);
            res.send({
                signupSuccess: false,
                signupMessage: "SignUp Failed"
            })
        } else {
            console.log('Result: ' + JSON.stringify(result));
            const count = result[0].count;

            if (count > 0) {
                res.send({
                    signupSuccess: false,
                    signupMessage: "Email id already exists"
                })
            }
        }
    });

    pool.query('INSERT INTO owner SET ?', body, (err, result) => {
        if (err) {
            console.log(err);
            res.send({
                signupSuccess: false,
                signupMessage: "SignUp Failed"
            })
        } else {
            console.log('Inserted ' + body);
            res.send({
                signupSuccess: true,
                signupMessage: "Successful SignUp"
            })
        }
    });
});

module.exports = router;
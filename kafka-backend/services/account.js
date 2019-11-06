//require('../config/Passport);

var express = require('express');
const mysql = require('mysql');
var router = express.Router();
const uuid = require("uuid");
const passport = require('passport');
const mongoose = require('mongoose');

require('../models/Buyer');
require('../models/Owner');

const Buyer = mongoose.model('Buyer');
const Owner = mongoose.model('Owner');

exports.followService = function followService(msg, callback) {
    console.log("Inside kafka backend account.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);

    switch (msg.path) {
        case "signin":
            signin(msg.body, callback);
            break;

        case "signup":
            signup(msg.body, callback);
            break;
    }
};

function next() {
    console.log(arguments)
}

function signup(msg, callback) {
    console.log("orderAdd req");
    console.log(msg);

    // const {body: {user}} = msg;
    const user = msg.user;

    console.log("save user");
    console.log(user);

    const finalUser = ("buyer" === user.userType ? new Buyer(user) : new Owner(user));

    finalUser.setPassword(user.password);
    finalUser.userType = user.userType;

    console.log("finalUser");
    console.log(finalUser.toAuthJSON());

    return finalUser.save()
        .then(() => callback(null, finalUser.toAuthJSON()));
}

function signin(msg, callback) {
    const req = {};
    req.body = msg;

    console.log("signin req");
    console.log(req);

    signinInner(req, callback, next)
}

function signinInner(msg, callback, next) {
    console.log("signin msg");
    console.log(msg);

    // const req = {};
    // req.body = msg;
    passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        console.log("Inside passport.authenticate");
        console.log("passportUser");
        console.log(passportUser);


        console.log("Checking if error");
        if (err) {
            console.log("Error;");
            //res.send('Error')
            callback(null, {
                signinSuccess: false,
                signinMessage: "Login failed",
                user: null
            });
        }

        console.log("Checking if passportUser is not null");
        if (passportUser !== undefined) {

            console.log("passportUser is not null");
            const user = passportUser;
            user.token = passportUser.generateJWT();

            console.log("generatedJWT");
            user.userType = msg.body.userType;
            console.log("Got userType");

            console.log("user");
            console.log(user);

            console.log("user.toAuthJSON()");
            console.log(user.toAuthJSON());

            callback(null, {
                signinSuccess: true,
                signinMessage: "Successful Login",
                user: user.toAuthJSON()
            })
        } else {
            console.log("passportUser is null");

            callback(null, {
                signinSuccess: false,
                signinMessage: "Login failed",
                user: null
            })
        }

    })(msg, callback, next);
}

function selectedTopics(msg, callback) {

    users.findOneAndUpdate({_id: msg.body.userid}, {$push: {topics_followed: {$each: msg.body.topics}}}, function (err, result) {
        if (err) {
            console.log(err)
            callback(null, {
                selectTopicsSuccess: false,
                select_topics: false,
                isTopicSelected: false,
                topics: []
            })
        } else {
            var criteria = {
                name: {$in: msg.body.topics}
            };
            topics.updateMany(criteria, {$inc: {num_of_followers: 1}}
                , function (err, result) {
                    if (err) {
                        console.log(err)
                        callback(null, {
                            selectTopicsSuccess: false,
                            select_topics: false,
                            isTopicSelected: false,
                            topics: []
                        })
                    } else {
                        for (let i = 0; i < result.length; i++) {
                            console.log("Topics name : ", result[0].name)
                            console.log("Topics followers : ", result[0].num_of_followers)
                        }

                        callback(null, {
                            selectTopicsSuccess: true,
                            select_topics: true,
                            topics: msg.body.topics,
                            isTopicSelected: true
                        })
                    }
                })
        }
    })
}
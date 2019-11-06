var express = require('express');
const mysql = require('mysql');
var router = express.Router();
const uuid = require("uuid");
const passport = require('passport');
const mongoose = require('mongoose');

require('../models/Chat');
const Chat = mongoose.model('chat');

exports.followService = function followService(msg, callback) {
    console.log("Inside kafka backend account.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);

    switch (msg.path) {
        case "get":
            get(msg.body, callback);
            break;

        case "message/add":
            messageAdd(msg.body, callback);
            break;
    }
};


function messageAdd(msg, callback) {
    console.log("orderAdd req");
    console.log(msg);

    Chat.updateOne(
        {_id: msg.chat_id},
        {$push: {messages: msg.message}})
        .then(() => {
            Chat.find({buyer_id: msg.buyer_id})
                .then((chatResult) => {
                    console.log("chatResult /message/add");
                    console.log(chatResult);
                    callback(null, chatResult);
                })
        });
}

function get(msg, callback) {
    console.log("orderAdd req");
    console.log(msg);

    const field = msg.userType === "buyer" ? "buyer_id" : "owner_id";
    const value = msg.userType === "buyer" ? msg.buyer_id : msg.owner_id;

    //If order_id is not present, insert chat for order and return all chats
    Chat.findOne({order_id: msg.order_id})
        .then((chat) => {
            if (chat === null) {
                const chat = Chat(msg);
                chat.save()
                    .then(() => {
                        // Chat.find({buyer_id: msg.buyer_id})
                        Chat.find({[field]: value})
                            .then((chatResults) => {
                                console.log("chatResult 1");
                                console.log(chatResults);
                                callback(null, chatResults);
                            });
                    });
                //If order_id is present, find and update to change TS and return all chats
            } else {
                const chatObj = {};
                chatObj.customer_name = msg.customer_name;

                Chat.findOneAndUpdate({order_id: msg.order_id}, chatObj)
                    .then(() => {
                        Chat.find({[field]: value})
                            .then((chatResult) => {
                                console.log("chatResult 2");
                                console.log(chatResult);
                                callback(null, chatResult);
                            });
                    })

            }

        })
        .catch((err) => {
            console.log("Error in getByOwnerMongo");
            console.log(err)
        })
}
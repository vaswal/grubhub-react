var express = require('express');
const mysql = require('mysql');
var router = express.Router();
const pool = require("../DbConnection");
const uuid = require("uuid");
const passport = require('passport');
const mongoose = require('mongoose');
const auth = require('./Auth');
const kafka = require('./kafka/client');

require('../models/Chat');
const Chat = mongoose.model('chat');

// router.post('/get', auth.optional, (req, res) => {
//     console.log("chat get");
//     console.log("req.body");
//     console.log(req.body);
//
//     kafka.make_request('chat', {"path":"get", "body": req.body}, function(err,result) {
//         console.log('in result');
//         console.log(result);
//
//         if (err){
//             console.log("Error in getByOwnerMongo")
//         } else {
//             res.send(result);
//         }
//     });
//
//     //If order_id is not present, insert chat for order and return all chats
//     // Chat.findOne({order_id: req.body.order_id})
//     //     .then((chat) => {
//     //         if (chat === null) {
//     //             const chat = Chat(req.body);
//     //             chat.save()
//     //                 .then(() => {
//     //                     Chat.find({buyer_id: req.body.buyer_id})
//     //                         .then((chatResults) => {
//     //                             console.log("chatResult 1");
//     //                             console.log(chatResults);
//     //                             res.send(chatResults)
//     //                         });
//     //                 });
//     //             //If order_id is present, find and update to change TS and return all chats
//     //         } else {
//     //             const chatObj = {};
//     //             chatObj.customer_name = req.body.customer_name;
//     //
//     //             Chat.findOneAndUpdate({order_id: req.body.order_id}, chatObj)
//     //                 .then(() => {
//     //                     Chat.find({buyer_id: req.body.buyer_id})
//     //                         .then((chatResult) => {
//     //                             console.log("chatResult 2");
//     //                             console.log(chatResult);
//     //                             res.send(chatResult)
//     //                         });
//     //                 })
//     //
//     //         }
//     //
//     //     })
//     //     .catch((err) => {
//     //         console.log("Error in getByOwnerMongo");
//     //         console.log(err)
//     //     })
// });

router.post('/get', auth.optional, (req, res) => {
    console.log("chat get");
    console.log("req.body");
    console.log(req.body);

    kafka.make_request('chat', {"path": "get", "body": req.body}, function (err, result) {
        console.log('in result');
        console.log(result);

        if (err) {
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });

    // const field = req.body.userType === "buyer" ? "buyer_id" : "owner_id";
    // const value = req.body.userType === "buyer" ? req.body.buyer_id : req.body.owner_id;
    //
    // //If order_id is not present, insert chat for order and return all chats
    // Chat.findOne({order_id: req.body.order_id})
    //     .then((chat) => {
    //         if (chat === null) {
    //             const chat = Chat(req.body);
    //             chat.save()
    //                 .then(() => {
    //                     // Chat.find({buyer_id: req.body.buyer_id})
    //                     Chat.find({[field]: value})
    //                         .then((chatResults) => {
    //                             console.log("chatResult 1");
    //                             console.log(chatResults);
    //                             res.send(chatResults)
    //                         });
    //                 });
    //             //If order_id is present, find and update to change TS and return all chats
    //         } else {
    //             const chatObj = {};
    //             chatObj.customer_name = req.body.customer_name;
    //
    //             Chat.findOneAndUpdate({order_id: req.body.order_id}, chatObj)
    //                 .then(() => {
    //                     Chat.find({[field]: value})
    //                         .then((chatResult) => {
    //                             console.log("chatResult 2");
    //                             console.log(chatResult);
    //                             res.send(chatResult)
    //                         });
    //                 })
    //
    //         }
    //
    //     })
    //     .catch((err) => {
    //         console.log("Error in getByOwnerMongo");
    //         console.log(err)
    //     })
});

router.post('/message/add', auth.optional, (req, res) => {
    console.log("/message/add get");
    console.log("req.body");
    console.log(req.body);

    kafka.make_request('chat', {"path": "message/add", "body": req.body}, function (err, result) {
        console.log('in result');
        console.log(result);

        if (err) {
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });


    // Chat.updateOne(
    //     {_id: req.body.chat_id},
    //     {$push: {messages: req.body.message}})
    //     .then(() => {
    //         Chat.find({buyer_id: req.body.buyer_id})
    //             .then((chatResult) => {
    //                 console.log("chatResult /message/add");
    //                 console.log(chatResult);
    //                 res.send(chatResult)
    //             })
    //     });

});


module.exports = router;
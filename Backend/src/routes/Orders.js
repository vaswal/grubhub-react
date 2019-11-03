const express = require('express');
const router = express.Router();
const msg = require('../../index.js');
const pool = require("../DbConnection");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
var kafka = require('./kafka/client');


require('../models/Section');
require('../models/MenuItem');
require('../models/Owner');
require('../models/Order');


//routes - src - backend - lab1
const imageStorePath = path.join(__dirname, '..', '..', '..', 'Frontend', 'src', 'images', 'grubhub');

router.get('/', function (req, res) {
    pool.query("SELECT * FROM grubhub_order where owner_id='0987'", (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('Result: ' + JSON.stringify(result));
            res.send(result)
        }
    });
});

const Order = mongoose.model('grubhub_order');
const Section = mongoose.model('menu_section');
const MenuItem = mongoose.model('menu_item');
const Owner = mongoose.model('Owner');

const queryMap = new Map();
queryMap.set("UPDATE_ORDER_STATUS", 'UPDATE grubhub_order SET status=? where grubhub_order_id=?');
queryMap.set("GET_MENU_ITEMS_BY_OWNER", 'SELECT * FROM menu_item where owner_id=?');
queryMap.set("GET_GRUBHUB_ORDERS_BY_OWNER", 'SELECT * FROM grubhub_order where owner_id=?');
queryMap.set("GET_GRUBHUB_ORDERS_BY_BUYER", 'SELECT * FROM grubhub_order where buyer_id=?');
queryMap.set("ADD_SECTION", "INSERT INTO menu_section values (?, ?, ?)");
queryMap.set("GET_SECTION", 'SELECT name from menu_section where owner_id=?');
queryMap.set("DELETE_SECTION", 'DELETE from menu_section where name=? and owner_id=?');
queryMap.set("ADD_MENU_ITEM", 'INSERT INTO  menu_item values (?, ?, ?, ?, ?, ?, ?)');
queryMap.set("DELETE_MENU_ITEM", 'DELETE from  menu_item where menu_item_id=?');
queryMap.set("UPDATE_MENU_ITEM", 'UPDATE menu_item set where menu_item_id=?');
queryMap.set("GET_RESTAURANTS", 'SELECT * from owner where id in (SELECT DISTINCT owner_id FROM menu_item WHERE UPPER(name) LIKE UPPER(?))');
queryMap.set("INSERT_IN_GRUBHUB_ORDER", 'INSERT INTO grubhub_order values (?, ?, ?, ?, ?, ?, ?)');
//queryMap.set("INSERT_IN_MENU_ITEM", 'INSERT INTO menu_item VALUES (?, ?, ?, ?, ?, ?, ?)');

router.post('/section/get', function (req, res) {
    console.log("section/get req.body");
    console.log(req.body);

    Section.find({owner_id: req.body.owner_id})
        .then((sections) => {
            console.log("sections");
            console.log(sections);
            res.send(sections)
        })
        .catch(() => {
            console.log("Error in getByOwnerMongo")
        })
});

router.post('/section/add', function (req, res) {
    const section = Section(req.body);

    return section.save()
        .then(() => {
            res.send("Saved section")
        })
        .catch(res.send("Error in saving section"));
});


router.post('/section/delete', function (req, res) {
    kafka.make_request('order', {"path":"section/delete", "body": req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err){
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });
});

router.post('/order/update', function (req, res) {
    console.log("req.body");
    console.log(req.body);
    const order = Order(req.body);
    console.log("order");
    console.log(order);

    kafka.make_request('order', {"path":"order/update", "body": req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err){
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });
});

router.post('/order/add', function (req, res) {
    kafka.make_request('order', {"path":"order/add", "body": req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err){
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });
});

router.post('/order/get', function (req, res) {
    const section = Order(req.body);

    return section.save()
        .then(() => {
            res.send("Saved section")
        })
        .catch(res.send("Error in saving section"));
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, '/Users/vijendra4/GoogleDrive/sjsu/273/lab1/grubhub/Frontend/src/images/grubhub')
        cb(null, imageStorePath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});


//const upload = multer({ storage: storage }).single('file');
const upload = multer({storage: storage}).single('file');

router.post('/menu_item/add', function (req, res) {
    upload(req, res, function (err) {
        console.log("Inside saveMenuItemImage");
        console.log(req.body);
        console.log("req.body.image");
        console.log(req.body.image);
        console.log("File");
        console.log(req.file);

        const menuItem = MenuItem(req.body);

        return menuItem.save()
            .then(() => {
                res.send("Saved menu_item")
            })
            .catch(() => res.send("Error in saving menu_item"));
    })
});

router.post('/menu_item/get', function (req, res) {
    kafka.make_request('order', {"path":"menu_item/get", "body": req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err){
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });
});

router.post('/menu_item/search', function (req, res) {
    console.log("menu_item/search");
    console.log(req.body);

    kafka.make_request('order', {"path":"menu_item/search", "body": req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err){
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });
});

router.post('/get/byBuyer', function (req, res) {
    console.log("req.body");
    console.log(req.body);

    kafka.make_request('order', {"path":"get/byBuyer", "body": req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err){
            console.log("Error in getByOwnerMongo")
        } else {
            res.send(result);
        }
    });
});

router.post('/getByOwner', function (req, res) {
    console.log("req.body");
    console.log(req.body);

    kafka.make_request('order', {"path":"getByOwner", "body":req.body}, function(err,result) {
        console.log('in result');
        console.log(result);

        if (err) {
            console.log(err);
            console.log("Answer not found");
            res.status(400).json({ responseMessage: 'Answer not found' });
        } else {
            res.send(result);
        }
    });
});



router.post('/update', function (req, res) {
    console.log("Inside update");
    console.log(req.body);

    const query = queryMap.get(req.body.queryName);
    console.log("query: " + query);

    pool.query(query, req.body.arguments, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('Result: ' + JSON.stringify(result));
            res.send(result)
        }
    });
});

router.post('/updateMenuItem', function (req, res) {
    console.log("Inside updateMenuItem");
    console.log(req.body);

    pool.query('UPDATE menu_item set ' + req.body.itemsToBeSet + ' where menu_item_id=?', req.body.arguments, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('Result: ' + JSON.stringify(result));
            res.send({message: "Successfully updated menu item"})
        }
    });
});

module.exports = router;
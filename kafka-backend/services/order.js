var express = require('express');
const mysql = require('mysql');
var router = express.Router();
const uuid = require("uuid");
const passport = require('passport');
const mongoose = require('mongoose');

//require('../models/Section');
require('../models/MenuItem');
require('../models/Owner');
require('../models/Order');

const Order = mongoose.model('grubhub_order');
// const Section = mongoose.model('menu_section');
const MenuItem = mongoose.model('menu_item');
const Owner = mongoose.model('Owner');

exports.followService = function followService(msg, callback) {
    console.log("Inside kafka backend account.js");
    // console.log("msg"+ msg);
    console.log("msg", msg);
    console.log("In Property Service path:", msg.path);

    switch (msg.path) {
        case "get/byBuyer":
            getByBuyer(msg.body, callback);
            break;
        case "menu_item/search":
            menuItemSearch(msg.body, callback);
            break;

        case "menu_item/get":
            menuItemGet(msg.body, callback);
            break;

        case "order/add":
            orderAdd(msg.body, callback);
            break;

    }
};

function orderAdd(msg, callback) {
    console.log("orderAdd req");
    console.log(msg);

    const order = Order(msg);

    order.save()
        .then(() => {
            callback(null, {
                placeOrderSuccess: true,
                placeOrderMessage: "Successfully placed order"
            });
        })
        .catch((error) => {
            console.log("error");
            console.log(error);
            callback(null, {
                placeOrderSuccess: false,
                placeOrderMessage: "Error in placing order"
            });
        });
}

function menuItemGet(msg, callback) {
    console.log("menuItemGet req");
    console.log(msg);

    MenuItem.find({owner_id: msg.owner_id})
        .then((menu_items) => {
            console.log("menu_items");
            console.log(menu_items);
            callback(null, menu_items);
        })
        .catch(() => {
            console.log("Error in getByOwnerMongo")
        })
}

function menuItemSearch(msg, callback) {
    console.log("menuItemSearch req");
    console.log(msg);

    MenuItem.find({name: {$regex: msg.searchTerm, $options: 'i'}})
        .then((menu_items) => {
            console.log("menu_items");
            console.log(menu_items);

            const owner_ids = menu_items.map(menu_item => menu_item.owner_id);

            Owner.find({_id: {$in: owner_ids}})
                .then((restaurants) => {
                    console.log("restaurants");
                    console.log(restaurants);
                    callback(null, restaurants);
                })
        })
        .catch(() => {
            console.log("Error in getByOwnerMongo")
        })

}

function getByBuyer(msg, callback) {
    console.log("getByOwnerMongo req");
    console.log(msg);

    Order.find({buyer_id: msg.userId})
        .then((orders) => {
            console.log("orders");
            console.log(orders);
            callback(null, orders);
        })
        .catch(() => {
            console.log("Error in getByOwnerMongo")
        })
}
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pool = require("../DbConnection");
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const imageStorePath = path.join(__dirname, '..', 'files');
const auth = require('./Auth');
const mongoose = require('mongoose');

require('../models/Buyer');

router.get('/', function (req, res) {
    res.send("hello from profile");
});
const Buyer = mongoose.model('Buyer');

const queryMap = new Map();
queryMap.set("GET_RESTAURANT_NAME", 'SELECT restaurantname from owner where id=?');
queryMap.set("GET_BUYER_NAME", 'SELECT firstname, lastname from buyer where id=?');
queryMap.set("INSERT_BUYER_IMAGE", 'UPDATE buyer SET image=? where id=?');
queryMap.set("GET_BUYER_IMAGE", 'SELECT image from buyer WHERE id=?');

// router.post('/get', function(req, res) {
//     Buyer.find({_id: req.body.buyerId})
//         .then((menu_items) => {
//             console.log("menu_items")
//             console.log(menu_items)
//             res.send(menu_items)
//         })
//         .catch(() => {console.log("Error in getByOwnerMongo")})
// });

router.post('/getByQuery', function (req, res) {
    console.log("Inside getByOwner");
    console.log("req.body");
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


// router.post('/get', function(req, res) {
//     console.log("Inside Login Post Request");
//     console.log("req.body")
//     console.log(req.body);
//     let body = {
//         userId: req.body.userId,
//         userType: req.body.userType
//     }
//     console.log("userType: " + body.userType);
//
//     pool.query(`SELECT * FROM ${body.userType} where id=?`, [body.userId], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.send(err);
//         } else {
//             console.log('Result: ' +  JSON.stringify(result));
//             res.send(result)
//         }
//     });
// });

router.post('/get', auth.optional, function (req, res) {
    console.log("profile /get");
    console.log("req.body");
    console.log(req.body);

    Buyer.find({_id: req.body.buyerId})
        .then((buyer) => {
            console.log("buyer");
            console.log(buyer);
            res.send(buyer)
        })
        .catch(() => {
            console.log("Error in getByOwnerMongo")
        })


    // pool.query(`SELECT * FROM ${body.userType} where id=?`, [body.userId], (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         res.send(err);
    //     } else {
    //         console.log('Result: ' +  JSON.stringify(result));
    //         res.send(result)
    //     }
    // });
});

router.post('/getImage', function (req, res) {
    console.log("Inside /image");
    console.log(req.body);

    const query = queryMap.get(req.body.queryName);
    console.log("query: " + query);

    pool.query(query, req.body.arguments, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('Result: ' + result[0].image);
            if (result[0].image !== null) {
                console.log("Non null image");
                // const form = new FormData();
                // form.append('my_file', fs.createReadStream(result[0].image));
                // res.set({'Content-Type': 'image/png'});
                // res.sendFile(result[0].image);
                //var bitmap = fs.readFileSync(result[0].image);
                // convert binary data to base64 encoded string
                //res.send(new Buffer.from(bitmap).toString('base64'));
                res.send(result[0].image)
            } else {
                console.log("nullImage");
                res.send("nullImage");
            }

        }
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/Users/vijendra4/GoogleDrive/sjsu/273/lab1/grubhub/Frontend/src/images/grubhub')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});


//const upload = multer({ storage: storage }).single('file');
const upload = multer({storage: storage}).single('file');

router.post('/image', function (req, res) {
    upload(req, res, function (err) {
        console.log("Inside /image");
        console.log(req.body);
        console.log(req.body.userId);
        console.log("File");
        console.log(req.file);
        console.log("userId");
        console.log(req.userId);

        if (err instanceof multer.MulterError) {
            console.log(err);
            return res.status(500).json(err)
        } else if (err) {
            console.log(err);
            return res.status(500).json(err)
        }

        const query = queryMap.get(req.body.queryName);
        console.log("query: " + query);
        //const filePath = path.join(imageStorePath, req.file.originalname);
        const filePath = req.file.originalname;

        pool.query(query, [filePath, req.body.userId], (err, result) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('Result: ' + JSON.stringify(result));
            }
        });

        return res.status(200).send(req.file)
    })
});

router.post('/update', function (req, res) {
    console.log("Inside updateBuyerProfile Post Request");
    console.log("req.body");
    console.log(req.body);

    if ("firstName" in req.body) {
        pool.query(`UPDATE ${req.body.userType} SET firstname=?, lastname=? where id=?`, [req.body.firstName, req.body.lastName, req.body.userId], (err, result) => {
            if (err) {
                console.log(err);
                res.send({
                    updateSuccess: false,
                    updateMessage: "Unsuccessful Update"
                });
            } else {
                console.log('Result: ' + JSON.stringify(result));
                res.send({
                    updateSuccess: true,
                    updateMessage: "Successful Update"
                })
            }
        });
    } else {
        const columnName = Object.keys(req.body)[2];
        pool.query(`UPDATE ${req.body.userType} SET ${columnName}=? where id=?`, [req.body[columnName], req.body.userId], (err, result) => {
            if (err) {
                console.log(err);
                res.send({
                    updateSuccess: false,
                    updateMessage: "Unsuccessful Update"
                });
            } else {
                console.log('Result: ' + JSON.stringify(result));
                res.send({
                    updateSuccess: true,
                    updateMessage: "Successful Update"
                })
            }
        });
    }
});

module.exports = router;
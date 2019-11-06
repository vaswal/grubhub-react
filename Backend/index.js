//import the require dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const kafka = require('./src/routes/kafka/client');

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'abc123',
//     database: 'grubhub'
// });

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'grubhub'
});

const test ="test const value";

app.set('view engine', 'ejs');

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back   to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://54.149.48.114:3000');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//     res.setHeader('Cache-Control', 'no-cache');
//     next();
// });

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

const accessBasePath = '/access';
const profileBasePath = '/profile';
const ordersBasePath = '/orders';
const chatBasePath = '/chats';

const accessRoutes = require('./src/routes/Access');
const profileRoutes = require('./src/routes/Profile');
const orderRoutes = require('./src/routes/Orders');
const chatRoutes = require('./src/routes/Chat');

//use cors to allow cross origin resource sharing
//app.use(cors({ origin: 'http://54.149.48.114:3000', credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json({ limit: "50MB" }));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//mongoose.connect('mongodb://localhost:27017/grubhub')
mongoose.connect("mongodb+srv://root:MyPasswordIsStrong123@mongocluster-nhhlj.mongodb.net/grubhub",
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, poolSize: 100})
    .then(() =>  console.log('Connection succesful'))
    .catch((err) => console.error(err));

require('./src/models/Buyer');
require('./src/config/Passport');

app.use(accessBasePath, accessRoutes);
app.use(profileBasePath, profileRoutes);
app.use(ordersBasePath, orderRoutes);
app.use(chatBasePath, chatRoutes);
app.use(express.static('routes'));
app.use(express.static('files'));

app.get('/', function(req, res) {
    res.send("hello");
});

app.post('/book', function(req, res){

    kafka.make_request('post_book',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
            res.json({
                updatedList:results
            });

            res.end();
        }

    });
});

//start your server on port 3001
app.listen(3001, () => {
    console.log("Server Listening on port 3001");
});





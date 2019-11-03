const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const OwnerSchema = new Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    password: String,
    phoneNumber: String,
    restaurantName: String,
    cuisine: String,
    hash: String,
    salt: String
});

OwnerSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

OwnerSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

OwnerSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

OwnerSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        userType: "owner",
        token: this.generateJWT(),
    };
};

mongoose.model('Owner', OwnerSchema);
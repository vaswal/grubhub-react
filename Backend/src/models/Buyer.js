const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {Schema} = mongoose;

const BuyerSchema = new Schema({
    firstName: String,
    lastName: String,
    emailId: String,
    hash: String,
    salt: String,
});

BuyerSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

BuyerSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

BuyerSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        emailId: this.emailId,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1, 10),
    }, 'secret');
};

BuyerSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        userType: "buyer",
        token: this.generateJWT(),
    };
};

mongoose.model('Buyer', BuyerSchema);
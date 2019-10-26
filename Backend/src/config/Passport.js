const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Buyer = mongoose.model('Buyer');
const Owner = mongoose.model('Owner');

passport.use(new LocalStrategy({
    usernameField: 'user[emailId]',
    passwordField: 'user[password]',
    passReqToCallback: true
}, (req, username, password, done) => {
    console.log("In Outside LocalStrategy");
    console.log("username: " + username);
    console.log("password: " + password);
    console.log("req: ");
    console.log(req.body);

    const model = ("buyer" === req.body.user.userType ? Buyer : Owner);

    model.findOne({emailId: username})
        .then((user) => {
            if (!user || !user.validatePassword(password)) {
                console.log("Not found or okay");
                return done(null, false, {errors: {'email or password': 'is invalid'}});
            }
            console.log("Found");

            return done(null, user);
        }).catch(done);
}));
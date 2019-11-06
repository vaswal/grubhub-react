const chai = require('chai')
chaiHttp = require('chai-http');

chai.use(chaiHttp);

const expect = chai.expect;

describe('post /access/login', () => {
    it("Should check credentials and return 200 status code and successful signin message", function(done) {
        chai.request('http://127.0.0.1:3001')
            .post('/access/loginkafka')
            .send({"user": {"emailId": "Alice", "password": "Alice", "userType": "owner"}})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.signinMessage).to.eq("Successful Login")
                done();
            });
    })
});

describe('post /access/create', () => {
    it("Should insert user in DB and return 200 status code and successful signup message", function(done) {
        chai.request('http://127.0.0.1:3001')
            .post('/access/create')
            .send({"firstName": "SomeFirstName", "lastName": "SomeLastName", "emailId": "emailId@emailId.com", "password": "password@password"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.signupMessage).to .eq("Successful SignUp")
                done();
            });
    })
});

describe('post /orders/updateMenuItem', () => {
    it("Should update menu item in DB and return 200 status code and successfully updated menu item message", function(done) {
        chai.request('http://127.0.0.1:3001')
            .post('/orders/updateMenuItem')
            .send({"itemsToBeSet": "name='SomeName'", "arguments": ["73423"]})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.message).to.eq("Successfully updated menu item")
                done();
            });
    })
});

describe('post /profile/update', () => {
    it("Should update user profile in DB and return 200 status code and successful update message", function(done) {
        chai.request('http://127.0.0.1:3001')
            .post('/profile/update')
            .send({"userId": "657845", "userType": "buyer", "email": "xx"})
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.updateMessage).to.eq("Successful Update")
                done();
            });
    })
});

describe('post /access/createOwner', () => {
    it("Should create user in DB and return 200 status code and email id already exists message", function(done) {
        chai.request('http://127.0.0.1:3001')
            .post('/access/createOwner')
            .send({"firstName": "SomeFirstName",
                "lastName": "SomeLastName",
                "emailId": "q",
                "password": "password@password",
                "phoneNumber": "somePhonenumber",
                "restaurantName": "Somerestaurantname",
                "cuisine": "Somecuisine"
            })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body.signupMessage).to.eq("Email id already exists")
                done();
            });
    })
});


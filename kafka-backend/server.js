var connection = new require('./kafka/Connection');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://root:MyPasswordIsStrong123@mongocluster-nhhlj.mongodb.net/grubhub",
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => console.log('Connection succesful'))
    .catch((err) => console.error(err));


require('./models/Buyer');
require('./models/Owner');
require('./config/Passport');
//topics files
//var signin = require('./services/signin.js');
var Books = require('./services/books.js');
var account = require('./services/account.js');
var order = require('./services/order.js');
var chat = require('./services/chat.js');

//

function handleTopicRequest(topic_name, fname) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');

    consumer.on('error', function (err) {
        console.log("Kafka Error: Consumer - " + err);
    });

    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name + " ", fname);
        console.log('message.value ')
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        switch (topic_name) {
            case 'access':
                console.log('topic_name = access ')
                account.followService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'order':
                console.log('topic_name = order ')
                order.followService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'chat':
                console.log('topic_name = chat ')
                chat.followService(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                })
                break;
            case 'post_book':
                console.log('topic_name = post_book ')
                fname.handle_request(data.data, function (err, res) {
                    response(data, res, producer);
                    return;
                });
                break;
        }
    });
}

function response(data, res, producer) {
    console.log('after handle', res);
    var payloads = [
        {
            topic: data.replyTo,
            messages: JSON.stringify({
                correlationId: data.correlationId,
                data: res
            }),
            partition: 0
        }
    ];
    producer.send(payloads, function (err, data) {
        console.log('producer send', data);
    });
    return;
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("chat", chat)
handleTopicRequest("access", account)
handleTopicRequest("order", order)
handleTopicRequest("post_book", Books)

var kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function (topic_name) {
        this.client = new kafka.KafkaClient("localhost:2181");
        this.kafkaConsumerConnection = new kafka.Consumer(this.client, [{topic: topic_name, partition: 0}]);
        this.client.on('ready', function () {
            console.log('client ready!')
        })

        return this.kafkaConsumerConnection;
        // this.client = new kafka.KafkaClient({kafkaHost: 'localhost:2181'});
        // this.kafkaConsumerConnection = new kafka.Consumer(this.client,
        //     [{ topic: topic_name, partition: 0, offset: 0}],
        //     {autoCommit: false});
        //
        //     //this.client = new kafka.Client("localhost:2181");
        //     //this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0, offset: 0 }]);
        // this.client.on('ready', function () { console.log('Consumer is ready for topic:', topic_name) })
        // return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function () {
        if (!this.kafkaProducerConnection) {
            this.client = new kafka.KafkaClient("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
        // if (!this.kafkaProducerConnection) {
        //     this.client = new kafka.KafkaClient({kafkaHost: 'localhost:2181'});
        //     //this.client = new kafka.Client("localhost:2181");
        //     var HighLevelProducer = kafka.HighLevelProducer;
        //     this.kafkaProducerConnection = new HighLevelProducer(this.client);
        //     console.log('Topic Producer is ready');
        // }
        // return this.kafkaProducerConnection;
    };
}

exports = module.exports = new ConnectionProvider;

const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatSchema = new Schema({
    customer_name: String,
    customer_address: String,
    items: String,
    status: String,
    owner_id: String,
    buyer_id: String
});

mongoose.model('chat', ChatSchema);

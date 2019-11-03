const mongoose = require('mongoose');
const {Schema} = mongoose;

const OrderSchema = new Schema({
    customer_name: String,
    customer_address: String,
    items: String,
    status: String,
    owner_id: String,
    buyer_id: String,
    price: String
});

mongoose.model('grubhub_order', OrderSchema);

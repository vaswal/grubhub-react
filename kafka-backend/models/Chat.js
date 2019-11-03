const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatSchema = new Schema({
    messages: [],
    customer_name: String,
    customer_address: String,
    order_id: String,
    items: String,
    status: String,
    owner_id: String,
    buyer_id: String,
    price: String,
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

mongoose.model('chat', ChatSchema);

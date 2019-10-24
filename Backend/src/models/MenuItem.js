const mongoose = require('mongoose');
const {Schema} = mongoose;

const SectionSchema = new Schema({
    name: String,
    description: String,
    price: String,
    image: String,
    section: String,
    owner_id: String
});

mongoose.model('menu_item', SectionSchema);
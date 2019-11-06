const mongoose = require('mongoose');
const {Schema} = mongoose;

const SectionSchema = new Schema({
    name: String,
    owner_id: String
});

mongoose.model('menu_section', SectionSchema);
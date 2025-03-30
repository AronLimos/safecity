const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Non-Urgent', 'Alert', 'Critical'],
        required: true,
    },
});

module.exports = mongoose.model('Category', categorySchema);

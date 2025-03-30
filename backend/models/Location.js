const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['North', 'South', 'West', 'East', 'Northeast', 'Northwest',
            'Southeast', 'Southwest'],
        required: true,
    },
});

module.exports = mongoose.model('Location', locationSchema);

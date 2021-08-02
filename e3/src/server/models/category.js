const mongoose = require('mongoose');

// Define collection and schema for todo item

const category = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        order: {
            type: Number,
        },
        activate: {
            type: Boolean,
        },
        color: {
            type: String,
        },
        news: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'News',
            },
        ],
    },
    {
        collection: 'category',
    }
);

module.exports = mongoose.model('Category', category);

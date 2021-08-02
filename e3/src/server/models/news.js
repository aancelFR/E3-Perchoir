const mongoose = require('mongoose');
const Category = require('./category');
var random = require('mongoose-simple-random');
// Define collection and schema for todo item

const news = new mongoose.Schema(
    {
        titre: {
            type: String,
        },
        description: {
            type: String,
        },
        activate: {
            type: Boolean,
        },
        frequence: {
            type: Number,
            validate: {
                validator: function(v) {
                    return v > 0 && v <= 10;
                },
                message: 'Frequence invalide.',
            },
        },
        nbDisplay: {
            type: Number,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    {
        collection: 'news',
    }
);

news.plugin(random);
module.exports = mongoose.model('News', news);

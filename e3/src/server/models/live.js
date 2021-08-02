const mongoose = require('mongoose');

// Define collection and schema for todo item

const live = new mongoose.Schema(
    {
        titre: {
            type: String,
        },
        url: {
            type: String,
            validate: {
                validator: function(v) {
                    var re = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
                    return re.test(v);
                },
                message: 'Url is invalid.',
            },
        },
        activate: {
            type: Boolean,
        },
    },
    {
        collection: 'live',
    }
);

module.exports = mongoose.model('Live', live);

var mongoose = require('mongoose');
require('../server/server.js');
var counter = new mongoose.Schema({
    _id : {type : String},
    seq : Number
})

module.exports.count = mongoose.model('counters', counter);
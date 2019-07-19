var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    console.log("we are connected");
})

module.exports = db;

let express = require('express');
let App = express();

App.use(express.json())
require('../routes/routes.js')(App)
App.listen(3005)
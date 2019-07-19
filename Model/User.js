var mongoose = require('mongoose');
require('../server/server.js');
var userSchema = new mongoose.Schema({
    id : {type : Number},
    name: {type : String, lowercase : true, required : true},
    dob : {type : String},
    gender : {type : String, lowercase : true},
    address : {type : String, lowercase : true},
    profession : {type : String, lowercase : true}
  });

module.export.user = db.model('users', userSchema);
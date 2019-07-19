let express = require('express')
let app = express()
var cors = require('cors')
let Mongo = require('mongodb').MongoClient;
var moment = require('moment');
moment().format();
app.use(express.json())


var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/users', {useNewUrlParser: true});

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    
        console.log("we are connected");
    })

var userSchema = new mongoose.Schema({
    id : {type : Number},
    name: {type : String, lowercase : true, required : true},
    dob : {type : String},
    gender : {type : String, lowercase : true},
    address : {type : String, lowercase : true},
    profession : {type : String, lowercase : true}
  });

var counter = new mongoose.Schema({
    _id : {type : String},
    seq : Number
})

var count = mongoose.model('counters', counter);

async function getNextSequence(name) {
    let id;
   return await count.findOneAndUpdate(
           { _id: name },
        { $inc: { seq: 1 } },
        function (err, docs) {
            console.log(typeof(docs.seq));
            return docs.seq;
        }
    ).then((obj)=>{
        console.log(obj);
        console.log(obj.seq);
        return obj.seq
    })   
 }

 async function create(){

 }

app.post('/create', (req, res) => {

    var user = db.model('users', userSchema);
    //res.setHeader('Content-Type', 'application/html');
    console.log(req.body.name);
    getNextSequence('userid').then((seq)=> {
        //console.log(seq);
        return new Promise (resolve => {
            user.create({
                id : seq,
                name : req.body.name,
                dob : req.body.dob,
                gender : req.body.gender,
                address : req.body.address,
                profession : req.body.profession
            }, function (err, arr) {
                if (err) return res(500).send("Enter the valid")
                else
                    resolve("inserted");
              });

            
        }).then((resolve)=>{
            if(resolve === 'inserted'){
                return resolve;
            }
        })
        
    }).then((str)=>{
        if(str === 'inserted')
            res.status(200).send("saved");
    }).catch((err) => {
        console.log(err);
    })
    
})

async function getdata(userid){

    var user = db.model('users', userSchema);
    return await user.find({
        id : userid
    }, function(err, arr){
        if(err) return err;
        else
            return arr
    })
}

app.get('/get/:userid', (req, res) => {

    let userid = req.params.userid;
    
    getdata(userid).then((arr)=>{
        if(arr.length === 0){
            res.status(500).send("Enter Valid Userid");
        }
        else{
            res.status(200).send(arr);
        }
    })
})

async function edit(obj){

    var user = db.model('users', userSchema);

    return await user.updateOne({id : obj.id}, {
                $set : {
                    name : obj.name,
                    dob : obj.dob,
                    gender : obj.gender,    
                    address : obj.address,
                    profession : obj.profession
                }
            }, function(err, obj){
        if(err){
            console.log(err);
        } else {
            console.log(obj)
            return obj;
        }
    })
}

app.post('/edit', (req, res) => {

    var obj = req.body;
    console.log(obj);
    edit(obj).then((obj) =>{
        if(obj.nModified === 0)
            res.status(404).send("Please give a valid object. UserId is invalid");
        else{
            res.status(200).send("User is Updated");
        }
    })
})

async function del(obj){

    var user = db.model('users', userSchema);

    return await user.deleteOne({id : obj.id}, function(err, arr){
        if(err){
            return err;
        }
        else{
            return arr;
        }
    })
}

app.post('/delete', (req, res) => {

    var obj = req.body;
    console.log(obj);
    del(obj).then((ob) =>{

        if(ob.deletedCount === 1){
            res.status(404).send("User Not Found");
        } else{
            res.status(500).send("User Deleted")
        }
    })
})

async function filterQuery(query){

    var user = db.model('users', userSchema);

    return await user.find(query, (err, arr) => {
        if(err)
            return err
        else{
            console.log(arr);
            return arr;
            }
        })
    }

app.get('/filter', (req, res) => {

    let query = req.query;
    let p = Object.keys(query);

    console.log(query);

    let f = 0;
    p.forEach((value) => {
        if(value === 'age' || value === 'name' || value === 'gender' || value === 'profession'){
           
        } else {
            f=1;
        }
    })
    
    if(f===0){
        
        if(query.hasOwnProperty('age')){
            
            var age = parseInt(query.age) * 365 * 24 * 60 * 60 * 1000; //in Millis
            console.log(typeof(age) + age);
            var dateOfBirth = new Date(new Date().getTime() - age).getFullYear().toString();
        
            let obj = {
                dob : { $regex: dateOfBirth , $options : 'i'}
            }
            if(query.hasOwnProperty('name')){
                obj.name = query.name;
            }
            if(query.hasOwnProperty('gender')){
                obj.gender = query.gender;
            }
            if(query.hasOwnProperty('profession')){
                obj.profession = query.profession;
            }
            // filterAge(query.age).then((arr) => {
            //     res.send(arr);
            // })
            filterQuery(obj).then((arr)=> {
                console.log(arr);
                res.send(arr);
            })
        } else{
            filterQuery(query).then((arr)=> {

                if(arr.length === 0){
                    res.status(404).send("does not exist");
                }
                else{
                    console.log(arr);
                    res.status(200).send(arr);
                }
                
            })
        }
    }
    })
app.listen(3005)

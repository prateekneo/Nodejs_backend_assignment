let express = require('express')
let app = express()
var cors = require('cors')
let Mongo = require('mongodb').MongoClient;
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
   
    // .exec(function (err, docs) {
    //     console.log(typeof(docs.seq));
    //     id= docs.seq;
    // })

    
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
                if (err) return console.log(err)
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
            res.send("saved");
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
            return arr;
    })
}

app.get('/get/:userid', (req, res) => {

    let userid = req.params.userid;
    
    getdata(userid).then((arr)=>{
        res.send(arr);
    })
})

async function edit(obj){

    var user = db.model('users', userSchema);

    return await user.findOneAndUpdate({id : obj.id}, {
                $set : {
                    name : obj.name,
                    dob : obj.dob,
                    gender : obj.gender,
                    address : obj.address,
                    profession : obj.profession
                }
            },{new : true}, function(err, arr){
        if(err){
            console.log(err);
        } else {
            return arr;
        }
    })
}

app.post('/edit', (req, res) => {

    var obj = req.body;
    console.log(obj);
    edit(obj).then((str) =>{
            res.send(str);
    })
})

async function del(obj){

    var user = db.model('users', userSchema);

    return await user.findOneAndDelete({id : obj.id}, function(err, arr){
        if(err){
            console.log(err);
        }
    })
}

app.post('/delete', (req, res) => {

    var obj = req.body;
    console.log(obj);
    del(obj).then((str) =>{
        db.close();
        res.send(str);
    })
})

function getYears(x) {
    return Math.floor(x / 1000 / 60 / 60 / 24 / 365);
}

async function filterAge(age){

    var user = db.model('users', userSchema);

        let promises = [];
        let docs = await user.find({});
        
        docs.forEach((doc) => {
          let n = Date.now();
          let d = new Date(doc.dob);
          doc.set('age', getYears(n - d));
          promises.push(doc.save());
        });
        
        Promise.all(promises).then((saved) => {
          console.log(saved);
        });
        
}

async function filterName(name){

    var user = db.model('users', userSchema);

    return await user.find({name : name}, (err, arr) => {
        if(err){
            return err;
        }
        else{
            console.log(arr);
            return arr;
            }
        })
    }

async function filterGender(gender){

    var user = db.model('users', userSchema);

    return await user.find({gender : gender}, (err, arr) => {
        if(err)
            return err;
        else{
            console.log(arr);
            return arr;
            }
        })
    }

async function filterProfession(profession){

    var user = db.model('users', userSchema);

    return new Promise( resolve => {
        
        user.find({profession : profession}, (err, arr) => {
            console.log(arr);
            return arr;
        })
    })

}

app.get('/filter', (req, res) => {

    let query = req.query;
    //let c = Object.keys(query).length;
    let a = [];
        if(query.hasOwnProperty('age')){
            
            filterAge(query.age).then({

            })
        }
        if(query.hasOwnProperty('name')){

            filterName(query.name).then((arr) => {
                a = arr;
                //console.log(arr);
                console.log(a);
                a.forEach((value,index) => {
                    if(query.hasOwnProperty('gender')){
                        if(value.gender !== query.gender){
                            a.splice(index, 1);
                        }
                    }
                    if(query.hasOwnProperty('profession')){
                        if (value.profession !== query.profession){
                            a.splice(index, 1);
                        }
                    }
                })
                
                res.send(a); 
            })
        }
        else if(query.hasOwnProperty('gender')){
            console.log('gender');
            filterGender(query.gender).then((arr) => {
                a.push(...arr);
                console.log(a);
                a.forEach((value,index) => {
                    if(query.hasOwnProperty('name')){
                        if(value.name !== query.name){
                            a.splice(index, 1);
                        }
                    } else if(query.hasOwnProperty('profession')){
                        if (value.profession !== query.profession){
                            a.splice(index, 1);
                        }
                    }
                })
                console.log(a);
                res.send(a);
            })
        }
        else if(query.hasOwnProperty('profession')){

            filterProfession(query.profession).then((arr) => {
                a.push(...arr);
                a.forEach((value,index) => {
                    if(query.hasOwnProperty('gender')){
                        if(value.gender !== query.gender){
                            a.splice(index, 1);
                        }
                    } else if(query.hasOwnProperty('name')){
                        if (value.name !== query.name){
                            a.splice(index, 1);
                        }
                    }
                })
                res.send(a)
            })
        }
    }
)
app.listen(3005)

let services = require('../services/services.js');

let create = (req, res) => {

    let user = db.model('users', userSchema);
    //res.setHeader('Content-Type', 'application/html');
    console.log(req.body.name);
    services.getNextSequence('userid').then((seq)=> {
        //console.log(seq);
            let obj = {
                id : seq,
                name : req.body.name,
                dob : req.body.dob,
                gender : req.body.gender,
                address : req.body.address,
                profession : req.body.profession
            }
            service.create(obj).then((str) => {
                if (err) return console.log(err)
                else
                    return str;
              });

            
        }).then((resolve)=>{
            if(resolve === 'inserted'){
                return resolve;
            }
        }).catch((err) => {
        console.log(err);
    })
    
}

let get = (req, res) => {

    let userid = req.params.userid;
    
    services.getdata(userid).then((arr)=>{
        if(arr.length === 0){
            res.send("Enter Valid Userid");
        }
        else{
            res.send(arr);
        }
    })
}

let edit = (req, res) => {

    let obj = req.body;
    console.log(obj);
    services.edit(obj).then((obj) =>{
        if(obj.nModified === 0)
            res.send("Please give a valid object. UserId is invalid");
        else{
            res.send("User is Updated");
        }
    })
}

let del = (req, res) => {

    let obj = req.body;
    console.log(obj);
    services.del(obj).then((str) =>{
        res.send(str);
    })
}

let filter = (req, res) => {

    let query = req.query;
    console.log(query);
        
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
            services.filterQuery(obj).then((arr)=> {
                console.log(arr);
                res.send(arr);
            })
        } else{
            services.filterQuery(query).then((arr)=> {
                console.log(arr);
                res.send(arr);
            })
        }
    }

    let user = {
        create : create,
        get : get,
        edit : edit,
        del : del,
        filter : filter
    }
    module.exports = user;
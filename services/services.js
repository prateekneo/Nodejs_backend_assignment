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

async function create(obj){

    return  await user.create(obj, function (err, arr) {
        if (err) return console.log(err)
        else
            resolve("inserted");
      });

}

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

async function del(obj){

    var user = db.model('users', userSchema);

    return await user.findOneAndDelete({id : obj.id}, function(err, arr){
        if(err){
            console.log(err);
        }
    })
}

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

let services = {
    getNextSequence : getNextSequence,
    create : create,
    getdata : getdata,
    edit : edit,
    del : del,
    filterQuery : filterQuery
}

module.exports = services;
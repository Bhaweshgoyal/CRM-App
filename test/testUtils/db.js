const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");


let mongod ;

module.exports.connect = async() => {
// this will create an new instance of "MongoMemoryServer" and automactically start it
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri(); // =>  this will stop the server
    
    
    // connect mongoose with MongoMemoryServer ; 
    
    mongoose.connect(uri);
}


// disconnect or close the connection ;

module.exports.closeDatabase = async() => {
    // drop the Db

    await mongoose.connection.dropDatabase();
    // close the connection

    await mongoose.connection.close();
    //stop the server 
    await mongod.stop();
}


// clear the db // reove all the data

module.exports.clearDatabase = async() => {
    // to get all the collection im mongoDb
    const collections = mongoose.connection.collections;
        // for Each collection 
    for(const key in collections) {
        // get the current Table/collection
        const collection = collections[key];
        // delete all the rows/documents of current table/collection 
        // collection.deleteMany()
    }
}   
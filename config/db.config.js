require('dotenv').config();

const mongoDbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crmApp';
// const mongoDbUri = "mongodb+srv://goyalb567:nUyHmgdJ3mDfgFpw@crmapp-db.fftgwip.mongodb.net/?retryWrites=true&w=majority"
const dbName = "Cluster0";
module.exports = { mongoDbUri, dbName };
const mongoose = require('mongoose')
require('dotenv').config();

//Define the Mongodb connection Url
const mongoURL = process.env.mongoURL

//Setup Mongodb connection  
mongoose.connect(mongoURL,{});

//Mongoose maintains a default connection object representing the Mongodb connection.
const db = mongoose.connection;

//Define events listeners for Database connection
db.on('connected',()=>{
    console.log('Database Connected');
});
db.on('error',(err)=>{
    console.log('Database connection error',err)
})
db.on('disconnected',()=>{
    console.log('Database Disconnected')
});

//exporting db to server page
module.exports = db;

//importing files
const mongoose = require('mongoose');
const db = require('./db');
const express = require('express');
const app = express();
const user_route = require('./routes/userRoute');
require('dotenv').config(); 

//port for server
const PORT = process.env.PORT || 5000;

//for userRoutes
app.use('/api/',user_route);

//Server running 
app.listen(PORT,()=>{
    console.log(`Server Started at PORT ${PORT}`)
});
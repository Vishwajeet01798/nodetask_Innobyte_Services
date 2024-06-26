const  mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique: true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_varified:{
        type:Number,
        default:0
    }
});

module.exports= mongoose.model('User',userSchema);

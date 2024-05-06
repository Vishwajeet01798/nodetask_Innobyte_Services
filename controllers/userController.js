const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

//password bcrypt
const securePassword = async(password)=>{
    try{
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;
    }catch(err){
        console.log(err.message)
    }
};

//for sending mail
const sendVerifyEmail = async(username,email,user_id)=>{
  try{
    const transporter =  nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:465,
        secure:true,
        requireTLS:true,
        auth:{
            user: process.env.USER_ID,
            pass: process.env.PASSWORD
        }
      });

//What data to be send to email
      const mailOptions = {
          from: process.env.USER_ID,
          to:   email,
          subject:'Verification mail',
          html:'<p>Hello '+username+', please click here to <a href="http://127.0.0.1:8080/api/verify?id='+user_id+'"> Verify</a> your mail </p>'
      }
      transporter.sendMail(mailOptions,function(error,info){
        if(error)
          {
            console.log(error);
          }else{
            console.log("Email has been sent:",info.response);
          }
      })
  }catch(err){
    console.log(err.message)
  }
};

//rendering signup page.
const loadRegister = async(req,res)=>{
    try{
        res.render('signup');
    }catch(err){
        console.log(err.message)
    }
  };

// function for new users signup
const insertUser = async(req,res)=>{
    try{
        const spassword = await securePassword(req.body.password);
        //getting input value from the user 
      const user = new  User({
        username:req.body.username,
        email:req.body.email,
        password:spassword
      });
        //saving values to the database
      const userData = await user.save();
      if(userData){
        //verifying user data and sending email
        sendVerifyEmail(req.body.username,req.body.email,userData._id);
        res.render('signup',{message:"Succefully Signup, Please verify first with your confirmation mail link."});
      }else{
        res.render('signup',{message:"failed to Signup, Email already Exists"});
      }
    }catch(err){
        console.log(err.message);
    }
};

//verification for email
const verifyMail = async(req,res)=>{
  try{
    //verified email with the mail and updating verification
    const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});
    console.log(updateInfo);
    res.render('email-verified');
  }catch(error){
    console.log(error.message)
  }
};

//login user method

const loginLoad= async(req,res)=>{
  try{
    res.render('login')
  }catch(err){
    console.log(err.message)
  }
};

//verifying login

const verifyLogin = async(req,res)=>{
  try{
    const email = req.body.email
    const password = req.body.password
    const usersData = await User.findOne({email:email})
    if(usersData)
      {
        //bcrypt password for the verification
       const passwordMatch =await bcrypt.compare(password,usersData.password)
       if(passwordMatch){
        if(usersData.is_varified === 0){
          res.render('login',{message:"please verify your mail first to login.."})
        }else{
          //session for login
          req.session.user_id = usersData._id;
          res.redirect('/api/profile');
        }
       }else{
        res.render('login',{message:"Email and password is incorrect"});
       }
    }else{
      res.render('login',{message:"Email and password is incorrect"});
    }
  }catch(err){
    console.log(err.message)
  }
};

// users profile

const loadHome = async(req,res)=>{
  try{
    //find user information from _id getting from database
     const userData = await User.findById({ _id:req.session.user_id })
    res.render('profile',{user:userData});
  }catch(err){
    console.log(err.message)
  }
};

//Logout method
const userLogout = async(req,res)=>{
  try{ 
    //destroying session for logout
    req.session.destroy()
    res.redirect('login');
  }catch(err){
    console.log(err.message);
  }
}
//Exporting function to the routers
module.exports = {loadRegister,insertUser,verifyMail,loginLoad,verifyLogin,loadHome,userLogout};
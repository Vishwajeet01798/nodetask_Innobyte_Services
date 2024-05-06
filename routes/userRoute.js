const express = require('express');
const user_route = express();
const session = require('express-session');
const config = require("../config/config")
user_route.use(session({secret:config.sessionSecret}));
const auth = require('../middlewares/auth');
user_route.set('view engine','ejs');
user_route.set('views','./views/users');
const bodyParser = require('body-parser');

//middlewares
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

//importing functions from userscontroller 
const {loadRegister,insertUser,verifyMail,
    loginLoad,verifyLogin,loadHome,userLogout}= require('../controllers/userController');

//routes for the url pages
user_route.get('/signup',auth.isLogout,loadRegister);
user_route.post('/signup',insertUser);
user_route.get("/verify",verifyMail);
user_route.get('/',auth.isLogout,loginLoad);
user_route.get('/login',auth.isLogin,loginLoad);
user_route.post('/login',verifyLogin);
user_route.get('/profile',auth.isLogin,loadHome);
user_route.get('/logout',auth.isLogin,userLogout);

//exporting user route to the server page
module.exports = user_route;
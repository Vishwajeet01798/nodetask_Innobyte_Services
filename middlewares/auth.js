// middlewares for checking for user is login or not 
const isLogin = async(req,res,next)=>{
    try{
        if(req.session.user_id){}
        else{
            res.redirect('/api/');
        }
        next();
    }catch(err){
        console.log(err.message)
    }
}

const isLogout = async(req,res,next)=>{
    try{
        if(req.session.user_id){
            res.redirect('/api/home');
        }
        next();
    }catch(error){
        console.log(err.message);
    }
}

module.exports= {isLogin,isLogout};
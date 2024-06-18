function  requireLogin(req , res , next){
    
    

    // console.log("Username:"+req.session.username)

    if(req.session.username || req.session.user_id){
        //console.log("Username is:"+req.session.username)
        return next()
    }
    else{
        return res.status(401).send({message:"Unauthorized"})
    }
}

export default requireLogin
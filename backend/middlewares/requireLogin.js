function  requireLogin(req , res , next){

    if(req.session.username || req.session.user_id){
      
        return next()
    }
    else{
        return res.status(401).send({message:"Unauthorized"})
    }
}

export default requireLogin
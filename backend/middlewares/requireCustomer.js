function requireCustomer(req , res , next){
    
    if(req.session.role==="Customer"){

        return next()
    }
    else{
       return res.status(403).send("Forbidden")
    }
}

export default requireCustomer
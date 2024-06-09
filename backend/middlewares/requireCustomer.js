function requireCustomer(req , res , next){
    
    if(req.session.role==="Customer"){

        return next()
    }
    else{
        res.status(403).send("Unauthorized")
    }
}

export default requireCustomer
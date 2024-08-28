function requireAdmin(req , res , next){

            if(req.session.role =="Admin"){
          
                return next()
               }
            else
               return res.status(403).send({message:"Forbidden"})
}

export default requireAdmin
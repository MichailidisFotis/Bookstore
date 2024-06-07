import Joi from "joi"
 


const accept_book = data =>{
    const schema  = Joi.object({
        title : Joi.string().required(),
        author:Joi.string().required(),
        
        price:Joi.number().required(),
        image:Joi.any()

    }).unknown()

    return schema.validate(data)
}


export default accept_book
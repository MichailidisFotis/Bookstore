import Joi from "joi"
 


const accept_book = data =>{
    const schema  = Joi.object({
        title : Joi.string().required(),
        author:Joi.string().required(),
        price:Joi.number().required(),
        picture:Joi.any(),
        available:Joi.boolean()

    }).unknown()

    return schema.validate(data)
}


export default accept_book
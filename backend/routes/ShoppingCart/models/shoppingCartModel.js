import mongoose, { Schema } from "mongoose"



const shoppingCartSchema = new mongoose.Schema({

    user:{
        type:Schema.Types.ObjectId,
        required:true
    },

    books:[{
        type:Schema.Types.ObjectId,
        ref:"book"
    }],

    total_price:{
        type:Number,
        required:true
    }



})

const shoppingCartModel = mongoose.model('shoppingCart',shoppingCartSchema)


export default shoppingCartModel
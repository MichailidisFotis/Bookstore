import mongoose, { Schema } from "mongoose"


const shoppingCartSchema = new mongoose.Schema({

    user:{
        type:String,
        required:true
    },

    books:[{
        book_id:{type:String},
        quantity:{type:Number , default:1}
    }],

    total_price:{
        type:Number,
        default:0.0
    }
})

const shoppingCartModel = mongoose.model('shoppingCart',shoppingCartSchema)


export default shoppingCartModel
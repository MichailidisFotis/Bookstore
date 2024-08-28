
import mongoose from "mongoose"



const orderSchema = new mongoose.Schema({

    total_price:{
        type: Number
    },

    books :[{
        book_id:{type:String},
        quantity:{type:Number , default:1}}],
    
    state:{
        type:String,
        default:"Created"
    },
    user_id:{
        type:String,
        required:true
    },
    date:{
        type:'String',
        required:true
    }
})

const orderModel = mongoose.model('order',orderSchema)


export default orderModel
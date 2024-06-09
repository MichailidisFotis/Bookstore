
import mongoose from "mongoose"



const orderSchema = new mongoose.Schema({

    total_price:{
        type: Number
    },

    books :[{       
        type:String}],
    
    state:{
        type:String,
        default:"Created"
    },
    user_id:{
        type:String,
        required:true
    }
})

const orderModel = mongoose.model('order',orderSchema)


export default orderModel
import mongoose from "mongoose"



const bookSchema = new mongoose.Schema({

    title :{
        type:String,
        required:true,
        unique:true
    },
    author:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:true,
        default:0.0
    },
    picture:{
        
        type:String

    }

})

const bookModel = mongoose.model('book',bookSchema)


export default bookModel
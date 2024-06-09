import mongoose from "mongoose"



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true
    },
    firstname:{
        type:String,
        required: true
    },
    surname:{
        type:String,
        required: true
    },
    email:{
      type: String,
      required: true,
      unique:true
    },
    role:{
        type:String,
        required:true
    }

})

const userModel = mongoose.model('Users',userSchema)


export default userModel 
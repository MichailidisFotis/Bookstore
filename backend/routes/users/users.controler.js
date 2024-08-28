import validator from "email-validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

import dotenv from "dotenv"

import register_user from "./validation_schemas/register_user.js";

import userModel from "./models/userModel.js";
import shoppingCartModel from "../ShoppingCart/models/shoppingCartModel.js";
import orderModel from "../Orders/models/orderModel.js"

dotenv.config()

const accessTokenSecret="myaccesstoken";
var accessToken;


//*Signup
const signup = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var verify_password = req.body.verify_password;
  var firstname = req.body.firstname;
  var surname = req.body.surname;
  var email = req.body.email;
  var role = req.body.role;

  //*Check if password and verification password are the same
  if (password != verify_password) {
    return res.status(400).send({
      message: "Passwords must match",
      signup: false,
    });
  }

  //*Check if data inserted is correct
  const { error } = register_user(req.body);

  if (error) {
    return res.status(400).send({
      message: error.details[0].message.replace("_", " ").replace(/"/g, ""),

      signup: false,
    });
  }

  //*check if email form is valid
  const emailValid = validator.validate(email);

  if (!emailValid) return res.status(400).send({ message: "Email is invalid" });

  //*Check if username already exists
  const username_exists = await userModel
    .where({ username: username })
    .countDocuments();

  if (username_exists)
    return res.status(400).send({
      message: "Username already exists",
      signup: false,
    });

  //*check if email exists
  const email_exists = await userModel.where({ email: email}).countDocuments();

  if (email_exists)
    return res.status(400).send({
            message: "Email Already Exists",
            signup: false,
    });

  var hashedPassword = await bcrypt.hash(password, 10);

  //*Create user
  const user = new userModel({
    username: username,
    password: hashedPassword,
    firstname: firstname,
    surname: surname,
    email: email,
    role: role,
  });

  //*save document to Database
  await user.save();

  if (role == "Customer") {
    //*create shopping cart
    const ShoppingCart = new shoppingCartModel({
      user: user.id,
    });

    await ShoppingCart.save();
  }



  const transporter = nodemailer.createTransport({

    service:'Yahoo',
    auth: {
      user: process.env.email,
      pass: process.env.email_password,
    },


  });

  var mailOptions = {
    from: process.env.email,
    to: 'bookstoretestemail1@gmail.com',
    subject: 'Verification Email',
    text: `Registered as ${role}!`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


  //*send response
  return res.status(201).send({
    message: "Signup Successful, you received an email!!!",
    signup: true,
    user_id:user._id
  });
};



//*Login User
const login = async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  //*Check if username is inserted
  if (!username)
    return res.status(400).send({
      message: "Username must be inserted",
      login: false,
    });

  //*check if password is inserted
  if (!password)
    return res.status(400).send({
      message: "Password must be inserted",
      login: false,
    });

  //* Check if username exists
  const findUser = await userModel.findOne({
    username: username,
  });

  if (!findUser) {
    return res.status(404).send({
      message: "Username not found",
      login: false,
    });
  }



  //* check if passwords match
  var loginUser = await bcrypt.compare(password, findUser.password);

  if (!loginUser)
    return res.status(400).send({
      message: "Credentials are wrong",
      login: false,
    });

   
    req.session.user_id = findUser.id;
    req.session.username = findUser.username;
    req.session.firstname = findUser.firstname;
    req.session.surname = findUser.surname;
    req.session.email = findUser.email;
    req.session.role = findUser.role; 


   console.log("Username login: "+req.session.username)

  if (req.session.role == "Admin") {
    
    accessToken=jwt.sign({username:findUser.username , role:findUser.role } , accessTokenSecret)
    
    return res.status(200).send({
      message: "Logged in as admin",
      url:"/Admin",
      login: true,
      token:accessToken
    });}
  else{

    accessToken=jwt.sign({username:findUser.username , role:findUser.role } , accessTokenSecret)
    
    return res.status(200).send({
      message: "Logged in as customer",
      url:"/Customer",
      login: true,
      token:accessToken
    });
  }
};


//*Delete user
const delete_user = async (req, res) => {

  var user_id =  req.params.user_id;

  if (!mongoose.isValidObjectId(user_id))
      return res.status(400).send({message:"Invalid User ID"})


  var findUser =  await userModel.findById({
    _id:user_id
  })


  if (!findUser)
      return res.status(404).send({message:"User Not Found"})


  //*check if user has orders
  var has_orders =  await orderModel.findOne(
    {
      user:user_id
    })

  if (has_orders)
      return res.status(400).send({message:"User has pending orders"})

  //*delete user's cart
  await shoppingCartModel.findOneAndDelete({
    user:user_id
  })


  //*delete user
  await userModel.findByIdAndDelete({
    _id:user_id
  })

  return res.status(200).send({message:"User Deleted"})

};




//*Signout
const signout = async (req, res) => {


  req.session.destroy();

  return res.status(200).send({message:"Signout!!!" , url:"/"});
};



const getAll  = async(req,res)=>{
    var users =  await userModel.find({role:"Customer"}).select("_id firstname surname email username role")
    return res.status(200).send(users)
}


const update_user = async(req ,res)=>{

      var user_id =  req.session.user_id
      var new_email =  req.body.new_email;
      var new_username  =  req.body.new_username;


      if (!mongoose.isValidObjectId(user_id))
        return res.status(400).send({message:"Invalid User ID"})
  
  
      var findUser =  await userModel.findById({
      _id:user_id
        })
  
  
      if (!findUser)
        return res.status(404).send({message:"User Not Found"})

        //*check if email form is valid
      const emailValid = validator.validate(new_email);

     if (!emailValid) return res.status(400).send({ message: "Email form is invalid" });

      var username_exists = await userModel.findOne({
        username:new_username
      })
      
      if (username_exists)
          return res.status(400).send({
            message:"Username already exists"
          })

       
      var email_exists =  await userModel.findOne({
        email:new_email
      })

      if(email_exists)
          return res.status(400).send({
            message:"Email already exists"  
          })
        
      
          await userModel.findOneAndUpdate({
            _id:user_id
          },
          {username:new_username,
            email:new_email})

          req.session.username =  new_username
          req.session.email =  new_email

          return res.status(200).send({
            message:"User Information updated"
          })

}


const update_password =  async (req , res)=>{
      var new_password = req.body.new_password
      var old_password =  req.body.old_password
      var verify_new_password =  req.body.verify_new_password
      var user_id =  req.session.user_id

      var findUser = await userModel.findOne({
        _id:user_id,
      })

      //* check if passwords match
      var authorize_user = await bcrypt.compare(old_password, findUser.password);


      if (!authorize_user)
        return res.status(401).send({
          message:"Incorrect Password"
        })
        
        
      if(new_password != verify_new_password)
          return res.status(400).send({
              message:"Passwords must match"
        })

      var hashedPassword = await bcrypt.hash(new_password, 10);

      await userModel.findByIdAndUpdate({
        _id:user_id
      },
      {
        password:hashedPassword
      })  


      return res.status(200).send({
        message:"Password changed successfully"
      })

}


export default {
  login,
  delete_user,
  signup,
  signout,
  getAll,
  update_user,
  update_password
};

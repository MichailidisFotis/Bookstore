import validator from "email-validator";
import register_user from "./validation_schemas/register_user.js";
import userModel from "./models/userModel.js";
import bcrypt from "bcrypt"



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
    const email_exists = await userModel.where({ email: email }).countDocuments();

    if (email_exists)
      return res.status(400).send({
        message: "Email Already Exists",
        signup: false,
      });

    var hashedPassword =  await bcrypt.hash(password , 10)
    
    //*Create user
    const user = new userModel({
        username: username,
        password: hashedPassword,
        firstname: firstname,
        surname: surname,
        email: email,
        role:role
    });


    //*save document to Database
    await user.save();

    //*send response
    return res.status(201).send({
      message: "Signup Successful",
      signup: true,
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

    var loginUser =  await bcrypt.compare(password , findUser.password)

      if(!loginUser)
        return res.status(400).send({
            message: "Credentials are wrong",
            login: false,
          });

      if (findUser.role ==="Admin") {

        req.session.user_id = findUser.id;
        req.session.username = findUser.username;
        req.session.firstname = findUser.firstname;
        req.session.surname = findUser.surname;
        req.session.email = findUser.email;
        req.sessiom.role = findUser.role
        
        return res.status(200).send({
            message:"Logged in as admin",
            login:true     
        })
        
 
        


      }  
      else{

        req.session.user_id = findUser.id;
        req.session.username = findUser.username;
        req.session.firstname = findUser.firstname;
        req.session.surname = findUser.surname;
        req.session.email = findUser.email;
        req.sessiom.role = findUser.role

        return res.status(200).send({
            message:"Logged in as customer",
            login:true
        })
    
        }



};

//*Delete user
const delete_user = async (req, res) => {


  
};

//*Signout
const signout = async (req, res) => {


    req.session.destroy();

    return res.status(200).send("Signout!!!");
};

export default {
  login,
  delete_user,
  signup,
  signout,
};

import bodyParser from "body-parser";
import express from "express";
import usersControler from "./users.controler.js"

import authenticateJWT from "../../middlewares/authenticateJWT.js";
import requireLogin from "../../middlewares/requireLogin.js";
import requireAdmin from "../../middlewares/requireAdmin.js"
import requireCustomer from "../../middlewares/requireCustomer.js";

var jsonParser = bodyParser.json();



const router = express.Router();

//*route login
router.post("/login" , jsonParser , usersControler.login)

//*route to signup
router.post("/signup" , jsonParser , usersControler.signup)

//*route to signout
router.post("/signout", requireLogin ,authenticateJWT , usersControler.signout)

//*route to delete user
router.delete("/delete-user/:user_id" , requireLogin,authenticateJWT , requireAdmin , usersControler.delete_user)

//*route to get all users
router.get("/get-all-users" ,requireLogin,authenticateJWT , requireAdmin,  usersControler.getAll)

//*route to change user information
router.patch("/update-user" , jsonParser, requireLogin,authenticateJWT ,requireCustomer , usersControler.update_user)

//*route to change password
router.patch("/change-password" , jsonParser, requireLogin,authenticateJWT , usersControler.update_password)



export default router
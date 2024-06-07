import bodyParser from "body-parser";
import express from "express";
import usersControler from "./users.controler.js"
import requireLogin from "../../middlewares/requireLogin.js";
import requireAdmin from "../../middlewares/requireAdmin.js"

var jsonParser = bodyParser.json();




const router = express.Router();

//*route login
router.post("/login" , jsonParser , usersControler.login)

//*route to signup
router.post("/signup" , jsonParser , usersControler.signup)

//*route to signout
router.post("/signout", requireLogin , usersControler.signout)



//*route to delete user
router.delete("/delete-user/:user_id" , requireLogin , requireAdmin , usersControler.delete_user)






export default router
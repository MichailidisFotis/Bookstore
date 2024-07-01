import bodyParser from "body-parser";
import express from "express";
import multer from "multer";



import booksControler from "./books.controler.js";

import requireLogin from "../../middlewares/requireLogin.js";
import requireAdmin from "../../middlewares/requireAdmin.js"
import authenticateJWT from "../../middlewares/authenticateJWT.js";

var jsonParser = bodyParser.json();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })



const upload  =  multer({storage})




const router  = express.Router()

//*route to get all books in the database
router.get("/get-books" , requireLogin ,authenticateJWT , jsonParser , booksControler.getBooks)

router.get("/get-book-information/:book_id", requireLogin ,authenticateJWT , booksControler.getBook)


//*route to create new book
router.post("/add-book" ,requireLogin ,authenticateJWT , requireAdmin ,  jsonParser , upload.single('image') , booksControler.add_book);


//*route to delete book
router.delete("/delete-book/:book_id" , requireLogin,authenticateJWT , requireAdmin , jsonParser,booksControler.delete_book)



//*route to update book's details
router.patch("/update-book/:book_id" , requireLogin, authenticateJWT , requireAdmin ,jsonParser,booksControler.update_book)









export default router

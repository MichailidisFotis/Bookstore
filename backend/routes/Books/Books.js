import bodyParser from "body-parser";
import express from "express";
import multer from "multer";



import booksControler from "./books.controler.js";
import requireLogin from "../../middlewares/requireLogin.js";
import requireAdmin from "../../middlewares/requireAdmin.js"


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

//*GET request to get all books in the database
router.get("/get-books" , requireLogin , jsonParser , booksControler.getBooks)



//*POST request to create new book
router.post("/add-book" ,requireAdmin , requireLogin ,  jsonParser , upload.single('image') , booksControler.add_book);


//*DELETE request to delete book
router.delete("/delete-book/:book_id" , requireAdmin , requireLogin , jsonParser,booksControler.delete_book)



//*PATCH request to update book's details
router.patch("/update-book/:book_id" , requireAdmin , requireLogin ,jsonParser,booksControler.update_book)









export default router

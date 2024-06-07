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




const router  = express()


//*POST request to create new book
router.post("/add-book" ,  jsonParser , upload.single('image') , booksControler.add_book);


router.delete("/delete-book" , requireAdmin , requireLogin , jsonParser,
    booksControler.delete_book
)



export default router

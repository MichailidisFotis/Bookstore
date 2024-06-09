import fs from "fs"


import bookModel from "./models/bookModel.js"
import accept_book from "./validation_schemas/accept_book.js";
import { promisify } from "util";


const unLinkAsync  = promisify(fs.unlink)


const add_book = async(req , res)=>{

    var title  =  req.body.title;
    var author =  req.body.author;
    var price  =  req.body.price;
    var image =  req.file

    // console.log(req.file)

    const {error} =  accept_book(req.body)

    if (error) 
        return res.status(400).send({
            message: error.details[0].message.replace("_", " ").replace(/"/g, ""),
    
            book_added: false,});

        //*Create new Book
        const book = new bookModel({
            title: title,
            author: author,
            price: price,
            picture:req.file.originalname
        });
    
    
        //*save document to Database
        await book.save();        


        return res.status(201).send({
            messsage:"New Book added",
            book_added:true
        

        })


}

const delete_book =  async(req , res)=>{
    
    var book_id =  req.params.book_id;

    var find_book = await bookModel.findById({
        _id:book_id
    })

    if (find_book ==null) 
        return res.status(404).send("Book not Found")

    //* check if book is in an order or in a shopping cart , if yes then simply change "available" flag to false.
    //* else continue            
    



    //*delete book document from database
    await bookModel.findByIdAndDelete({
        _id:book_id
    })

    //*delete image from folder
    await unLinkAsync('./uploads/'+find_book.picture)
    
    return res
           .status(200)
           .send(`Book : ${find_book.title} deleted`)

}

const getBooks =  async(req ,res)=>{

    const books  =  await bookModel.find({})





    return res.status(200).send(books)

}

const update_book = async(req , res)=>{
        var book_id   = req.params.book_id;

        const find_book =  await bookModel.findById({
            _id : book_id
        })


        if(book_id ==null)
            return res.status(404).send("Book not Found")


        


}   


export default {add_book , delete_book , update_book , getBooks};
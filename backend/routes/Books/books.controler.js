import bookModel from "./models/bookModel.js"
import accept_book from "./validation_schemas/accept_book.js";


const add_book = async(req , res)=>{

    var title  =  req.body.title;
    var author =  req.body.author;
    var price  =  req.body.price;
    var image =  req.file

    console.log(req.file)

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


}


export default {add_book , delete_book};
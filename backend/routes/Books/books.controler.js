import fs from "fs"


import bookModel from "./models/bookModel.js"
import accept_book from "./validation_schemas/accept_book.js";
import { promisify } from "util";
import orderModel from "../Orders/models/orderModel.js";
import mongoose from "mongoose";
import shoppingCartModel from "../ShoppingCart/models/shoppingCartModel.js";


const unLinkAsync  = promisify(fs.unlink)


const add_book = async(req , res)=>{

    var title  =  req.body.title;
    var author =  req.body.author;
    var price  =  req.body.price;
    var image =  req.file

   

    const {error} =  accept_book(req.body)

    if (error) 
        return res.status(400).send({
            message: error.details[0].message.replace("_", " ").replace(/"/g, ""),
    
            book_added: false,});
        

    var title_exists =  await bookModel.findOne({
        title:title}
    )

    if(title_exists)
            return res.status(400).send({message:"Title already exists"})


        var book  
        //*Create new Book
        if (!req.file) {
            book = new bookModel({
                title: title,
                author: author,
                price: price,
                
            });
    
        
            //*save book document to Database
            await book.save(); 
        }
        else{
             book = new bookModel({
                title: title,
                author: author,
                price: price,
                picture:req.file.originalname
            });
        
        
            //*save document to Database
            await book.save();   

        }

        return res.status(201).send({
            message:"New Book added",
            book_added:true,
            book_id :book._id

        })


}

const delete_book =  async(req , res)=>{
    
    var book_id =  req.params.book_id;

    if (!mongoose.isValidObjectId(book_id))
            return res.status(400).send({message:"Invalid book ID !!!"})


    var find_book = await bookModel.findById({
        _id: book_id
    })

    if (find_book ==null) 
        return res.status(404).send({message:"Book not Found"})

    //* check if book is in an order or in a shopping cart 
    var book_in_order =  await orderModel.findOne({
        "books.book_id":book_id,
        state:"Created"
    })
    
    if(book_in_order)
            return res.status(400).send({message:"Cannot Delete, book is in an order"})

    
    //* check if book is in an order or in a shopping cart 
    var book_in_cart =  await orderModel.findOne({
            "books.book_id":book_id,
            
        })
    
        if(book_in_cart)
                return res.status(400).send({message:"Cannot Delete, book is in a shopping cart"})



    //*delete book document from database
    await bookModel.findByIdAndDelete({
        _id:book_id
    })

    //*delete image from folder
    if(find_book.picture)
        await unLinkAsync('./uploads/'+find_book.picture)
    
    return res
           .status(200)
           .send({message:`Book : ${find_book.title} deleted`})

}

const getBooks =  async(req ,res)=>{

    const books  =  await bookModel.find({})


    return res.status(200).send(books)

}

const update_book = async(req , res)=>{
        var book_id   = req.params.book_id;
        var new_price =  req.body.price

        if (!mongoose.isValidObjectId(book_id))
            return res.status(400).send({message:"Invalid book ID !!!"})

        const find_book =  await bookModel.findById({
            _id : book_id
        })


        if(!find_book)
            return res.status(404).send({message:"Book not Found"})

        await bookModel.findByIdAndUpdate({
            _id :book_id}
        ,
        {
                price:new_price
        })


        return res.status(200).send({message:"Book price updated"})
} 


const getBook=  async(req , res)=>{
        var book_id =  req.params.book_id

        if (!mongoose.isValidObjectId(book_id))
            return res.status(400).send({message:"Invalid book ID !!!"})

        const find_book =  await bookModel.findById({
            _id : book_id
        })

        if (!find_book)
            return res.status(404).send(
                {
                    message:"Book not found"
                }    
            )

        return res.status(200).send(find_book)

}


export default {add_book , delete_book , update_book , getBooks , getBook};
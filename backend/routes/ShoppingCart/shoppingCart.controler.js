import mongoose from "mongoose";

import shoppingCartModel from "./models/shoppingCartModel.js";
import bookModel from "../Books/models/bookModel.js";
import orderModel from "../Orders/models/orderModel.js";



const add_books_to_cart = async (req, res) => {
  var book_id = req.body.book_id;

  var total_price = 0.0;


  //*Check if Book_id is valid
  if (!mongoose.isValidObjectId(book_id))
    return res.status(400).send({message:"Invalid Book ID !!!"})


  //*Check if book exists
  var findBook = await bookModel.findById({
    _id: book_id,
  });

  if (!findBook) return res.status(404).send({message:"Book Not Found!!!"});

  //*check if book is already in shopping cart
  var findCart = await shoppingCartModel.findOne({
    user: req.session.user_id,
  });

  var books = findCart.books;

  total_price = findBook.price;
  




  if (books.length ==0 ) {

    console.log("HERERERE")

    await shoppingCartModel.findOneAndUpdate(
        {
          user: req.session.user_id,
          
        },
        {
          $push: {
            books: {
              book_id: book_id,
            },
          },
          $inc: { total_price: total_price },
        })

        return res
        .status(200)
        .send({message:"Shopping Cart Updated"})
  }



  var increase_quantity =  await shoppingCartModel.findOneAndUpdate(
    { $and:[
       {user: req.session.user_id},
       {"books.book_id" : book_id}
    ]
    },
    {
      $inc: { "books.$.quantity": 1 },
    }
  )
  

  



  await shoppingCartModel.findOneAndUpdate(
    {
      user: req.session.user_id,
      "books.book_id": book_id,
    },
    {
      $inc: { total_price: total_price },
    })





  await shoppingCartModel.findOneAndUpdate(
    {$and:[
      {user: req.session.user_id},
      {"books.book_id" :{$nin:[book_id]}},
      {"books.quantity": {$gt: 1}}]
      
    },
    {
      $push: {
        books: {
          book_id: book_id,
        },
      },
      $inc: { total_price: total_price },
    })


return res
        .status(200)
        .send({message:"Shopping Cart Updated"})






};



const remove_books_from_cart = async (req, res) => {
  var book_id = req.body.book_id;
  var total_price = 0.0;

  //*Check if Book_id is valid
  if (!mongoose.isValidObjectId(book_id))
    return res.status(400).send({message:"Invalid Book ID !!!"})


  var findBook =  await bookModel.findById({
    _id:book_id
  })


  if (!findBook)
      return res 
                .status(404)
                .send({message:"Book not found"})


total_price =  Number(findBook.price)


var decrease_price =  await shoppingCartModel.findOneAndUpdate({
  user:req.session.user_id},
{
  $inc: {
    total_price: -Number(total_price),
  },
})


var decrease_quantity  = await shoppingCartModel.findOneAndUpdate({
        user:req.session.user_id,
        "books.book_id":book_id
      },
      {
         $inc:{"books.$.quantity": -1} 
      })


      
var remove_object  = await shoppingCartModel.findOneAndUpdate({
    user:req.session.user_id,
    "books.book_id":book_id,
    "books.quantity":0
},
  {
    $pull: {
      books: {
        book_id: book_id,
      },
  }
}
)

  return res
            .status(200)
            .send({message:"Book Removed"});
};


const get_cart_information =  async(req , res)=>{

    var cart_information =  await shoppingCartModel.findOne(
      {user:req.session.user_id}
    )

    return res
        .status(200)
        .send(cart_information)
      
}



 //* Function to create order
const create_order = async (req, res) => {
  
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed
  const day = currentDate.getDate().toString().padStart(2, '0');
  
  const formattedDate = `${year}-${month}-${day}`;
  
  
  
  var user_cart = await shoppingCartModel.findOne({
    user: req.session.user_id,
  });

  //*check if "books" list is empty
  if (user_cart.books.length == 0)
    return res
              .status(400)
              .send({message:"Add some books before submiting"});

  //*create new order
  var order = new orderModel({
    total_price: user_cart.total_price,
    books: user_cart.books,
    user_id: req.session.user_id,
    date:formattedDate
  });

  await order.save();

  await shoppingCartModel.findOneAndUpdate(
    {
      user: req.session.user_id,
    },
    {
      total_price: 0.0,
      books: [],
    }
  );

  return res
            .status(201)
            .send({message:"Order Created"});
};

export default { add_books_to_cart, remove_books_from_cart, create_order
                ,get_cart_information};

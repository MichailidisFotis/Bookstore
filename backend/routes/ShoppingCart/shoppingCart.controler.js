import shoppingCartModel from "./models/shoppingCartModel.js";
import bookModel from "../Books/models/bookModel.js";
import orderModel from "../Orders/models/orderModel.js";

const add_books_to_cart = async (req, res) => {
  var book_id = req.body.book_id;

  var total_price = 0.0;

  var findBook = await bookModel.findById({
    _id: book_id,
  });

  if (!findBook) return res.status(404).send("Book Not Found!!!");

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
        .send("Shopping Cart Updated , New Book on cart")
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
        .send("Shopping Cart Updated")






};



const remove_books_from_cart = async (req, res) => {
  var ids_to_remove = req.body.ids_to_remove;
  var total_price = 0.0;

  //*remove books from shopping cart
  ids_to_remove.forEach(async (id) => {
    await shoppingCartModel.findOneAndUpdate(
      {
        user: req.session.user_id,
      },
      {
        $pullAll: {
          books: [id],
        },
      }
    );
  });

  var findBook;

  //* calculate total price to reduce
  for (var i = 0; i < ids_to_remove.length; i++) {
    findBook = await bookModel.findById({
      _id: ids_to_remove[i],
    });

    total_price += Number(findBook.price);
  }

  console.log(total_price);

  await shoppingCartModel.findOneAndUpdate(
    {
      user: req.session.user_id,
    },
    {
      $inc: {
        total_price: -Number(total_price),
      },
    }
  );

  return res.status(200).send("Books Removed");
};

const create_order = async (req, res) => {
  var user_cart = await shoppingCartModel.findOne({
    user: req.session.user_id,
  });

  //*check if "books" list is empty
  if (user_cart.books.length == 0)
    return res.status(400).send("Add some books before submiting");

  //*create new order
  var order = new orderModel({
    total_price: user_cart.total_price,
    books: user_cart.books,
    user_id: req.session.user_id,
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

  return res.status(201).send("Order Created");
};

export default { add_books_to_cart, remove_books_from_cart, create_order };

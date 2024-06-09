import bodyParser from "body-parser";
import express from "express";

import shoppingCartControler from "./shoppingCart.controler.js"

import requireLogin from "../../middlewares/requireLogin.js";
import requireCustomer from "../../middlewares/requireCustomer.js"


var jsonParser = bodyParser.json();


const router =  express.Router()

//*POST request to create order from shopping cart  
router.post("/create-order" ,jsonParser, requireLogin , requireCustomer , shoppingCartControler.create_order)




//*PATCH request to add books to cart
router.patch("/add-books-to-cart" ,jsonParser, requireLogin ,requireCustomer, shoppingCartControler.add_books_to_cart)


//*PATCH request to remove books from cart
router.patch("/remove-books-from-cart" ,jsonParser, requireLogin , requireCustomer ,shoppingCartControler.remove_books_from_cart)



export default router

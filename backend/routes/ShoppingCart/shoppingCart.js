import bodyParser from "body-parser";
import express from "express";

import shoppingCartControler from "./shoppingCart.controler.js"

import requireLogin from "../../middlewares/requireLogin.js";
import requireCustomer from "../../middlewares/requireCustomer.js"
import authenticateJWT from "../../middlewares/authenticateJWT.js";


var jsonParser = bodyParser.json();


const router =  express.Router()

//*route to get cart information
router.get("/get-cart-information" , requireLogin, authenticateJWT,requireCustomer , shoppingCartControler.get_cart_information)


//*route to create order from shopping cart  
router.post("/create-order" ,jsonParser, requireLogin , authenticateJWT, requireCustomer , shoppingCartControler.create_order)

//*route to add books to cart
router.patch("/add-books-to-cart" ,jsonParser, requireLogin,authenticateJWT, requireCustomer, shoppingCartControler.add_books_to_cart)

//*route to remove books from cart
router.patch("/remove-books-from-cart" ,jsonParser, requireLogin,authenticateJWT, requireCustomer ,shoppingCartControler.remove_books_from_cart)



export default router

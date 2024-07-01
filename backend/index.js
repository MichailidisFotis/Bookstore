import express from "express"
import session from "express-session"
import { fileURLToPath } from 'url';
import {dirname} from "path"
import mongoose from "mongoose";    
import bodyParser from "body-parser";
import dotenv from "dotenv"
import cors from "cors"

import usersRouter from "./routes/users/users.js"
import bookRouter from "./routes/Books/books.js";
import shoppingCartRouter from "./routes/ShoppingCart/shoppingCart.js"
import ordersRouter from "./routes/Orders/orders.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const PORT = 5000
var jsonParser = bodyParser.json();


const app =  express();
dotenv.config()

app.use(cors({  
  origin: 'http://localhost:4200', 
   credentials: true 
}))

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
    cookie: {
        maxAge:269999999999,
        secure:false
      }
}));


app.use("/users" , usersRouter);
app.use("/books" , bookRouter)
app.use("/shopping-cart" ,shoppingCartRouter)
app.use("/orders" ,ordersRouter)


const db_link =  process.env.db_link

mongoose.connect(db_link,{})
.then((res)=>console.log("Database Connected"))
.catch((err) =>console.error(err))




app.listen(PORT , () =>console.log('Listening to PORT: '+PORT))



export default app;
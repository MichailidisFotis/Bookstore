import express from "express"
import session from "express-session"
import { fileURLToPath } from 'url';
import {dirname} from "path"
import mongoose from "mongoose";    
import bodyParser from "body-parser";
import dotenv from "dotenv"


import usersRouter from "./routes/users/users.js"
import bookRouter from "./routes/Books/books.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const PORT = 5000
var jsonParser = bodyParser.json();


const app =  express();
dotenv.config()

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
    cookie: {
        maxAge:269999999999
      }
}));


app.use("/users" , usersRouter);
app.use("/books" , bookRouter)

const db_link =  process.env.db_link

mongoose.connect(db_link,{})
.then((res)=>console.log("Database Connected"))
.catch((err) =>console.error(err))




app.listen(PORT , () =>console.log('Listening to PORT: '+PORT))
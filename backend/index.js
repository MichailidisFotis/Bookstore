import express from "express"
import session from "express-session"
import { fileURLToPath } from 'url';
import {dirname} from "path"
import mongoose from "mongoose";    
import bodyParser from "body-parser";
import dotenv from "dotenv"



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


const db_link =  process.env.db_link

mongoose.connect(db_link,{})
.then((res)=>console.log("Database Connected"))
.catch((err) =>console.error(err))





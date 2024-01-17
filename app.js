const express=require("express");
const dotenv=require("dotenv");
const app=express();
const cors=require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus:200
  }));

dotenv.config({path:"./config.env"});
const PORT=process.env.PORT;
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./router/user.js'));
app.use(require("./router/blog.js"));



app.get("/",(req,res)=>{
    res.send("Home page");
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})

require("./db/connection.js");
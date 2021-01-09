if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config();
}
const express=require("express");
const app=express();
const expressLayouts=require('express-ejs-layouts');
const bodyParser=require('body-parser');
const indexRouter=require('./routes/index');
const authorRouter=require('./routes/authors');
const bookRouter=require('./routes/books');
app.set('view engine','ejs');   //select the view engine/templating engine
app.set('views',__dirname+'/views');  //set the path for any file in view folder
app.set('layout','layouts/layouts.ejs'); 

app.use(expressLayouts); //use express-ejs-layouts
app.use(express.static('public'));//use static pages from the public folder
app.use(bodyParser.urlencoded({limit:'10mb',extended:false})); //set the limit of body-parser library and it reads only encoded urls

const mongoose=require('mongoose');//import mongoose
mongoose.connect(process.env.DATABASE_URL|| 'mongodb://localhost/webdevsimplifiedmerncourse',{useNewUrlParser:true,useUnifiedTopology:true}); //connect to mongoose server
const db=mongoose.connection;
db.on('error',error=>console.error(error));
db.once('open',()=>console.log('Connected to mongoose'));

app.use('/authors',authorRouter);//use the imported file in routes folder(index.js file) for a url of /authors
app.use('/',indexRouter);        //for just the port name,use the imported file with path ./routes/index
app.use('/books',bookRouter);
app.listen(process.env.PORT||4000);

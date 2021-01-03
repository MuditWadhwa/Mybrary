const express=require('express');
//const author = require('../models/author');
const router=express.Router();
const Author=require('../models/author');

//All Authors Route
router.get('/',async(req,res)=>{
    let searchOptions={}
    if(req.query.name!=null && req.query.name!==''){
        searchOptions.name=new RegExp(req.query.name,'i');
    }
})
router.get('/',async (req,res)=>{//get the data present in the index.ejs file in authors folder if a url of / (or just localhost:3000) is encountered 
    try{
         const authors=await Author.find({});
         res.render('authors/index',{authors:authors,searchOptions:req.query});
    }                       
    catch{
        res.redirect('/');
    }
    
});

//new Author Route
router.get('/new',(req,res)=>{                     //if the url has /new in it at the end,get data from the new.ejs file in authors folder and render it
   res.render('authors/new',{author:new Author()});
});

//create new author
router.post('/',async (req,res)=>{ //if a new author is created in webpage with /new as a part of url,render the /create file
   const author=Author({name:req.body.name})
   try{
    const newAuthor= await author.save();
    //res.redirect(`authors/${newAuthor.id}`);
    res.redirect(`authors`);
   }
   catch{
   // let locals={errorMessage:'Error creating Author'};
    res.render('authors/new',{
        author:author,
        errorMessage:'Error creating Author'
        //locals 
    });  
   } 
  /* author.save((err,newAuthor)=>{
       if(err){
           let locals={errorMessage:'Error creating Author'};
           res.render('authors/new',{
               //author:author,
               //errorMessage:'Error creating Author'
               locals
           })
       }
       else
       {
           //res.redirect(`authors/${newAuthor.id}`);
           res.redirect(`authors`);
       }
   })
    res.send(req.body.name);
  */  
});

module.exports=router;  //export the router object to be used in other files
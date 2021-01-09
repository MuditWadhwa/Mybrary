const express=require('express');
//const author = require('../models/author');
const multer=require('multer');
const path=require('path');
const router=express.Router();
const fs=require('fs');
const Book=require('../models/book');
const uploadPath=path.join('public',Book.coverImageBasepath);
const Author=require('../models/author');
const ImageMimeTypes=['image/jpeg','image/png','image/gif'];
const upload=multer({
    dest:uploadPath,
    fileFilter:(req,file,callback)=>{
        callback(null,ImageMimeTypes.includes(file.mimetype));
    }
})
//All books Route
router.get('/',async (req,res)=>{
    let query=Book.find({});
    if(req.query.title!=null && req.query.title!='')
    {
        query=query.regex('title',new RegExp(req.query.title,'i'));
    }
    if(req.query.publishedBefore!=null && req.query.publishedBefore!='')
    {
        query=query.lte('publishDate',req.query.publishedBefore);
    }
    if(req.query.publishedAfter!=null && req.query.publishedAfter!='')
    {
        query=query.gte('publishDate',req.query.publishedAfter);
    }
    try{
        const books=await query.exec();
        res.render('books/index',{
            books:books,
            searchOptions:req.query
        });    
    }catch{
        res.redirect('/');
    }
    
});


//new Book Route
router.get('/new', async (req,res)=>{                     //if the url has /new in it at the end,get data from the new.ejs file in authors folder and render it
     renderNewPage(res,new Book());
});

//create Book Route
router.post('/',upload.single('cover'),async (req,res)=>{ //upload a single file named cover,execute the post request asynchronously
   const fileName=req.file!=null?req.file.filename:null; 
    const book=new Book({
         title:req.body.title,
         author:req.body.author,
         publishDate:new Date(req.body.publishDate),
         pageCount:req.body.pageCount,
         coverImageName:fileName,
         description:req.body.description
     });
     try{
        const newBook=await book.save();
     //   res.redirect(`books/${newBook.id}`); //book id changes in the url and the post request gets redirected to that url
        res.redirect(`books`);
     }catch{
         if(book.coverImageName!=null)
         {
            removeBookCover(book.coverImageName);
         }
         
        renderNewPage(res,book,true); //true signifies that the error exists
     };
});
function removeBookCover(fileName)
{
    fs.unlink(path.join(uploadPath,fileName),err=>{
        if(err) console.error(err);
    });
}
async function renderNewPage(res,book,hasError=false){   //async await help in passing values through ejs 
    try{
        const authors= await Author.find({});            
        //const book=new Book();
        const params={
            authors:authors,
            book:book
        };
        res.render('books/new',params);
        if(hasError) params.errorMessage='Error Creating Book';
   }catch{
                    
       res.redirect('/books');
   }
}
module.exports=router;  //export the router object to be used in other files
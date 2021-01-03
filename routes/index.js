const express=require('express');
const router=express.Router();


router.get('/',(req,res)=>{ //if the webpage with localhost:3000 is accessed,get the data after rendering it from index.ejs file
    res.render('index');
});
module.exports=router;
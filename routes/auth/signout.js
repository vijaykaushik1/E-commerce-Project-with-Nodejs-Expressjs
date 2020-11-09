//const { router } = require("../app");
var express = require('express');
var router = express.Router();
var message; //= 'You are logged out successfully';
// var data = {val:'1'}

 router.get('/', function(req, res, next) {
   var userId = req.session.userId;
   var adminId = req.session.adminid;

   console.log(1);
       if(userId == null && adminId == null){
          res.render('index',{ message: '', messagefail:' Please Sign in or Register', messageout:'', code : '', nav:''});
          return;
       } 
    req.session.destroy(function(err) {
       if(err){
          throw err
       }else{
         res.render('index',{ message: '',messageout:' You Signed out successfully', messagefail:'', code : '', nav:''}); //, 
         return;
       }
       

     })

});

module.exports = router;

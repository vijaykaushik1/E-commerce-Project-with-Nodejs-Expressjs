var express = require('express');
var router = express.Router();
var message = '';

/* GET home page. */
router.get('/', function(req, res, next){
   var adminid = req.session.adminid;
   if(adminid == null){
      res.render('index',{ message: '', messagefail:' Please Sign in with AdminId and Password.', messageout:'', code : '', nav:''});
      return;
      }
      res.render('admin/upload_product',{message:''});
 
  
});


router.post('/', function(req, res, next) {
  var adminid = req.session.adminid;
      if(adminid == null){
         res.render('index',{ message: '', messagefail:' ! Your Admin Id or Password is Wrong. Please Try Again', messageout:'', code : '', nav:''});
         return;
         }
        message = '';
        

           //var post  = req.body;
           var product_name= req.body.product_name.replace(/\s+/g, " ");
           //var uploaded_image= req.uploaded_image;
           var price= req.body.price;
           var category= req.body.category;
           var description= req.body.description;
      
         if(!req.files){
          return res.status(400).send('No files were uploaded.');
         }
            
         var file = req.files.uploaded_image;
         var uploaded_image=file.name;
      
            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                      
                   file.mv('public/images/upload_images/'+file.name, function(err) {
                                  
                     if(err)
                        return res.status(500).send(err);
                     
                           db.query('SELECT * FROM product_upload WHERE product_name=?', [product_name], function (error, results, fields) {
                           if (results.length > 0){
                           res.render('upload_product',{message:' This Product is already registered.'});
                           }
                           else{
                              var sql = "INSERT INTO `product_upload`(`product_name`,`uploaded_image`,`price`,`category`, `description`) VALUES ('" + product_name + "','" + uploaded_image + "','" + price + "','" + category + "','" + description + "')";
      
                              var query = db.query(sql, function(err, result) {
                 
                                 res.redirect('/product');
                              });
                           }      
                        
                        });
                  });
               } else {
                 message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
                 res.render('index',{message: '', messagefail: messagefail, messageout:'', nav:''});
               }
       
});

module.exports = router;

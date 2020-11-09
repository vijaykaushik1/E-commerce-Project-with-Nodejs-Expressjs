var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var adminid = req.session.adminid;
        if(adminid != null){
           res.render('upload_product',{ message: ' ! Please Sign out first'});
           return;
        } 

  var nav = "";
  var userId = req.session.userId;
    if(userId != null){     
      nav = "1";     
   }
  res.render('products/product_details', { message: '', messagefail:'', messageout:'', code:'', nav:nav});
});

/* Product Details */
router.get('/:id', function(req, res, next) {
  var nav = "";
  var userId = req.session.userId;
    if(userId != null){     
      nav = "1";     
   }
  var id = req.params.id;
  console.log("1st You reached in product_details/"+id);
 
  db.query('SELECT * FROM product_upload WHERE id=?', [id], function (error, results, fields) {
    console.log("2nd You reached in product_details/"+id);
	  
      console.log("3rd You reached in product_details/"+id);
      res.render('products/product_details',{data:results, nav:nav});  //  , email:userId
     
      
   });

});
module.exports = router;

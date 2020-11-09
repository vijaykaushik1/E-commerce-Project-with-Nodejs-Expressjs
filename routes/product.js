var express = require('express');
var router = express.Router();
var message = '';


/* All Products. */
router.get('/', function(req, res, next) {
   var nav = "";
  var userId = req.session.userId;
        if(userId == null){
           nav = "no";
        }

       

        

 
   var sql="SELECT * FROM `product_upload`";
    db.query(sql, function(err, result){
	  if(result.length <= 0)
	  message = "Profile not found!";
      res.render('product',{data:result, message: message, messageout:'', nav:nav});  //  , email:userId
   });
});

/* Smartphones sorting */
// router.get('/category', function(req, res, next) {
//    var nav = "";
//   var userId = req.session.userId;
//   var category = req.body.category;
//         if(userId == null){
//            nav = "no";
//         }
//         var sql="";
//     db.query("SELECT * FROM product_upload WHERE [category] in (?)",[category], function(err, result){
//       res.render('product',{data:result, message: message, messageout:'', nav:nav});  //  , email:userId
//    });
// });

module.exports = router;

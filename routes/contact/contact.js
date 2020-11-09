var express = require('express');
var router = express.Router();

/* GET Contact page. */
router.post('/', function(req, res, next) {
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
   var name = req.body.name;
   var email = req.body.email;
   var mobile = req.body.mobile;
   var comment = req.body.comment;

   var sql = "INSERT INTO feedback (name, email, mobile, comment) VALUES ('" + name + "', '" + email + "', '" + mobile + "', '" + comment + "')";  
   //var values = [name, email, mobile, comment];
   db.query(sql, function (err, result) {  
   if (err) throw err;  
   res.render('index', { message: '', messagefail:'', messageout:' Your feedback form submitted successfully. Thank you for your feedback.', code:'', nav:nav});
   });    
});

module.exports = router;

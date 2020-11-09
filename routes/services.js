var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var adminid = req.session.adminid;
        if(adminid != null){
           res.render('admin/upload_product',{ message: ' ! Please Sign out first'});
           return;
        }

  var nav = "";
  var userId = req.session.userId;
    if(userId != null){
      nav = "1";
   }

  res.render('services/services', { message: '', messagefail:'', messageout:'', code:'', nav:nav});
});

module.exports = router;

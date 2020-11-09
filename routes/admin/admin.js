var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var adminid = req.session.adminid;
        if(adminid != null){
           res.render('admin/upload_product',{ message: ' ! Please Sign out first'});
           return;
        } 
  res.render('admin/admin', {messagefail:'', messageout:''});
});

router.get('/adminsignout', function(req, res, next) {
    var adminid = req.session.adminid;
        if(adminid == null){
           res.render('index',{ message: '', messagefail:' Please Sign in or Register', messageout:'', code : '', nav:''});
           return;
        } 
        res.redirect('/signout');
   //   req.session.destroy(function(err) {
   //    //req.flash("success", "Signed Out");
   //    res.render('index',{ message: '', messagefail:'', messageout:' You Signed out successfuly', code : '', nav:''});
   //    return;
   //    })
 
 });

router.post('/', function(req, res, next) {
    var adminid = req.body.adminid;
    var pass = req.body.pass;
    db.query('SELECT * FROM admin WHERE adminid=? AND pass=? ', [adminid, pass], function (error, results, fields) {
  
     if (results.length > 0){
      //sess = email;
      req.session.adminid = results[0].adminid;

  
      //res.render('product',{message:'You logged in'});
      res.redirect('/upload_product');
     }else{
            res.render('index',{message : '', messagefail:' Your Admin Id or Password is wrong.', messageout:'', code : 'yes', nav:''});
                   
          }
      });
  });

module.exports = router;

var express = require('express');
var router = express.Router();
var message = '';
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.render('index',{message:'', messagefail:' Please enter email and password', messageout:'', code:'', nav:''});
// });

router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var userId = req.session.userId;
  if(userId!=null){
    res.render('index',{message : '', messagefail:' Before Signing again you need to sign out first.', messageout:'', code : 'yes', nav:'1'});
    return;
  }
  db.query('SELECT * FROM users WHERE email=? AND pass=? AND register=1', [email, password], function (error, results, fields) {

   if (results.length > 0){
    //sess = email;
    req.session.userId = results[0].email;
    req.session.pass = results[0].pass;    

    //res.render('product',{message:'You logged in'});
    res.redirect('/product');
   }else{
         db.query('SELECT * FROM users WHERE email=? AND pass=? AND register=0', [email, password], function (error, results, fields) {
           if (results.length > 0){
             res.render('index',{message : '', messagefail:' You did not verify your email so you have to register again.', messageout:'', code : 'yes', nav:''});
            }else{               
                res.render('index',{message : '', messagefail:' Your email or password is wrong.', messageout:'', code : 'yes', nav:''});
              }
          });
        }
    });
});


module.exports = router;

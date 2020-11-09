var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    var userId = req.session.userId;

    if(userId != null){
      res.render('index',{message : '', messagefail:'Before Making another account you need to Signout first.', messageout:'', code:'', nav:''});
      return;
    }

    var email = req.body.email;
    var code = req.body.code;      
    var value = 1;
    
   
    db.query('SELECT * FROM users WHERE email=? AND code=?', [email, code], function (error, results, fields) {
        if (results.length > 0){   
            var sql = "UPDATE users SET register=? WHERE register=0 AND email=?";
            db.query(sql,[value, email], function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //res.render('index',{ message : '', messagefail : '', messageout:'You are registered Successfully, Now you can Signin', code:email, nav:''});
                req.session.userId = results[0].email;
                //req.session.pass = results[0].pass;    

                //res.render('product',{message:'You logged in'});
                res.redirect('/product');
            });

         }else{
                res.render('code',{messagefail : 'You entered Wrong code Please try Again',messageout:'', code:code});
              }

    });
});



module.exports = router;

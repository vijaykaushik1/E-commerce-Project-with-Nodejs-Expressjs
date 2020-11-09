var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    var userId = req.session.userId;
    var messagefail = "";
    var nav = "1";
    console.log(1);
        if(userId == null){
           nav = "";
           res.render('index',{ message: '', messagefail:' Please Login or Sign up', messageout:'', code : '', nav:nav});
           return;
        } 
       console.log(3);
    db.query('SELECT * FROM users WHERE email=?', [userId], function(err, result){
      console.log(4);
      if(result[0].mobile==0||result[0].mobile==null){
        messagefail = ' Please Update Your Profile by clicking "Update your profile" button.';
      }
      db.query("SELECT * FROM orders WHERE userid LIKE '"+userId+"%' ORDER BY id DESC", function(err, results){
        //if(results.length>0){
          //console.log("Orders length : "+results[0].product_name);

          return res.render('profile',{data:result, messagefail:messagefail, nav:nav, results:results});  
       // }
      });       
    });
});

router.post('/', function(req, res, next) {
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;  
  var mobile = req.body.mobile;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var house_no = req.body.house_no;
  var colony = req.body.colony;  
  var landmark = '';
  if(req.body.landmark.length>0){
    var landmark = req.body.landmark;
  } 
  var city = req.body.city;
  var state = req.body.state;
  var address_type = req.body.address_type;

    var userId = req.session.userId;
    if(userId == null){
      res.render('index',{message : '', messagefail:' Before making any changes in profile. Please Sign in first.', messageout:'', nav:''});
      return;
    }else{      
            var sql = "UPDATE users SET first_name=?, last_name=?, mobile=?, country=?, pincode=?, house_no=?, colony=?, landmark=?, city=?, state=?, address_type=? WHERE email=?";
            db.query(sql,[first_name, last_name, mobile, country, pincode, house_no, colony, landmark, city, state, address_type, userId], function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                console.log("profile updated successfully");
                res.redirect('/profile');
                // res.end();
            });    
          } 
});


module.exports = router;

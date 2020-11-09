var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var round = 0;

/* GET home page. */
router.get('/data', function(req,res) {
  var email = req.session.userId;

  var status = 'not paid';

  var total_price = 0;
  var product = "  ";
  var qty = " * ";
  var space = "  ||  ";

  var key = '';
  var salt = '';

  var udf5 = 'BOLT_KIT_NODE_JS';
  var ord = JSON.stringify(Math.random()*100000);
  var i = ord.indexOf('.');
  ord = 'ORD'+ ord.substr(0,i);



  if(email == null){
    res.render('index',{ message: '', messagefail:' Please Sign In or Register', messageout:'', code : '', nav:''});
    return;
  }
  db.query('SELECT * FROM users WHERE email=?',[email], function(err, result){ // done

    if(result[0].mobile==0 || result[0].mobile==null){
      res.redirect('/profile');
      return;
    }
    var mobile = result[0].mobile;
    var email_id = email;
    var first_name = result[0].first_name;
    db.query("SELECT * FROM cart WHERE userid LIKE '"+email+"%'", function(err, result){   //done
      for(var i=0;i<result.length;i++){
        total_price = total_price + (result[i].price * result[i].quantity);
        product = product + (result[i].product_name) + qty + (result[i].quantity) + space;
      }
    });
    db.query("SELECT * FROM orders WHERE userid LIKE '"+email+"%' AND order_id LIKE '"+ord+"%' AND product_info LIKE '"+product+"%'", function(err, rslt){
      console.log("Rslt : "+rslt.length)
      if(rslt.length==0){
        db.query("SELECT * FROM cart WHERE userid LIKE '"+email+"%'", function(err, result){
        for(var i=0;i<result.length;i++){
            var sql ="INSERT INTO orders (userid, product_name, image, amount, category, quantity, status, order_id, product_info) VALUES ('"+result[i].userid+"','"+result[i].product_name+"','"+result[i].image+"','"+result[i].price+"','"+result[i].category+"','"+result[i].quantity+"','"+status+"','"+ord+"','"+product+"')";
            db.query(sql, function(err, results){
                if(results.length>0){
                  console.log("1 record inserted in pay.js get method")
                }
            });
          }
        });

      if(total_price.length <= 0 || total_price == undefined  ){
        res.redirect('/cart');
      }else{
          var amount = parseFloat(total_price);
          var pinfo = product;

          var cryp = crypto.createHash('sha512');
          var text = key+'|'+ord+'|'+amount+'|'+pinfo+'|'+first_name+'|'+email_id+'|||||'+udf5+'||||||'+salt;
          cryp.update(text);
          var hash = cryp.digest('hex');

          res.render('pay', {orderid:ord, key:key, salt:salt, pinfo:pinfo, amount:amount, first_name:first_name, email_id:email_id, mobile:mobile, hash:hash});

      }
     }else{
      console.log("Same orderid, productinfo and Product_name found in orders ");
      res.redirect('/cart');
    }

   });
  });
});


router.post('/', function(req, res){

      var nav = "";
      var userId = req.session.userId;
        if(userId != null){
          nav = "1";
      }
      var key = req.body.key;
      var salt = req.body.salt;
      var txnid = req.body.txnid;
      var amount = req.body.amount;
      var productinfo = req.body.productinfo;
      var firstname = req.body.firstname;
      var email = req.body.email;
      var udf5 = req.body.udf5;
      var mihpayid = req.body.mihpayid;
      var status = req.body.status;
      var resphash = req.body.hash;



      var keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|||||'+udf5+'|||||';
      var keyArray 		= 	keyString.split('|');
      var reverseKeyArray	= 	keyArray.reverse();
      var reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');

      var cryp = crypto.createHash('sha512');
      cryp.update(reverseKeyString);
      var calchash = cryp.digest('hex');

      var msg = 'Payment failed for Hash not verified...';
      if(calchash == resphash)
         msg = 'Transaction Successful and Hash Verified...';

         console.log("Response Hash : "+calchash);
         console.log("Round 1 : "+round);
         db.query("SELECT * FROM orders WHERE userid LIKE '"+userId+"%' AND order_id LIKE '"+txnid+"%' AND product_info LIKE '"+productinfo+"%'", async function(err, result){

           if(result.length > 0){
            db.query("UPDATE orders SET status=? WHERE userid LIKE '"+userId+"%' AND order_id LIKE '"+txnid+"%' AND product_info LIKE '"+productinfo+"%'",[status], async function(err, results) {
             //res.redirect('/profile');
             console.log("1st time record inserted");
             console.log("Round 2: "+round);
            });
           }
         });
         console.log("Round : 3"+(round+1));

      // res.render('transaction/show_trans', {key: key,salt: salt,txnid: txnid,amount: amount, productinfo: productinfo,
      // firstname: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash, msg:msg, nav:nav});
      res.redirect('/profile');

});

module.exports = router;

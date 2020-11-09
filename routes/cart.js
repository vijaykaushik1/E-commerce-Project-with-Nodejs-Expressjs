var express = require('express');
var router = express.Router();
var userid, newData;


/* GET home page. */
router.get('/', function(req, res, next) {
      var userId = req.session.userId;
      var email = userId;
      var total_price = 0;
      var new_price = 0;
      

      if(userId == null){
        res.render('index',{ message: '', messagefail:' Please Sign In or Register', messageout:'', code : '', nav:''});
        return;
      }
     
        db.query("SELECT * FROM cart WHERE userid LIKE '"+email+"%' ORDER BY id DESC", function(err, result){
          console.log("Lenght of result : "+result.length);
                  
          
          
          for(var i=0;i<result.length;i++){
            total_price = total_price + (result[i].price * result[i].quantity);
            /* 
            if(round == 0){
              var sql ="INSERT INTO orders (userid, product_name, image, price, category, quantity) VALUES ('"+result[i].userid+"','"+result[i].product_name+"','"+result[i].image+"','"+result[i].price+"','"+result[i].category+"','"+result[i].quantity+"')";
              db.query(sql, function(err, results){
                if(err) throw err;
                if(results.length>0){
                  console.log("1 record inserted")
                }
              });
            }
            */
                        
            
          }
          
          new_price = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            // limit to six significant digits (Possible values are from 1 to 21).
            maximumSignificantDigits: 6
          }).format(parseInt(total_price));
          if(total_price==0){
            new_price = "";
          }

          console.log(typeof total_price);
           res.render('cart',{data:result, total_price:new_price, nav:1});  //  email:email
       });




});

// Update quantity in cart
router.post('/', function(req, res, next){
 var nav = "";

  var email = req.session.userId;
  
  var id = req.body.id;

  if(email == null){
    res.render('index',{message: '', messagefail:' Please Sign in or Register', messageout:'', code:'', nav:nav})
    return;
 }

  var quantity = req.body.quantity;
  
  console.log("quantity : "+quantity);
  
  var userid;
  db.query("SELECT * FROM cart WHERE userid LIKE '"+email+"%'", function(err, results){
    if(quantity==0){
      res.redirect('/cart');
      return;
    }
    
    db.query("UPDATE cart SET quantity=? WHERE id=? AND userid LIKE '"+email+"%'",[quantity ,id], function(err, result) {     
      res.redirect('/cart');
    });
  });
});

// Remove Item from cart
router.get('/remove/:id', function(req, res, next){
  var userId = req.session.userId;
  var email = userId;
  var id = req.params.id;
  if(userId == null){
    res.render('index',{message: '', messagefail:' Please Sign in or Register', messageout:'', code:''})
    return;
 }
  var userid;


    var sql = "DELETE FROM cart WHERE id = ? AND userid LIKE '"+email+"%'";
    db.query(sql,[id], function(err, result) {
      res.redirect('/cart');
    });


  //res.send("<h1>You are in cart/remove/"+id+"</h2>");
});

// Add item in cart
router.get('/:id', function(req, res, next){
  var id = req.params.id;
  var email = req.session.userId;

  console.log(email);

  var quantity = 1;
  var product_name, image, price, quantity, total_price, category, description;

        if(email == null){
          res.redirect('/cart');
           //res.render('index',{message: '', messagefail:' Please Sign in or Register', messageout:'', code:'', nav:''})
           return;
        }
        console.log(req.params.id);

        // Getting data from upload_product
        db.query('SELECT * FROM product_upload WHERE id=? ', [id], function(err, result){
         product_name = result[0].product_name;
         console.log("Product Name : "+result[0].product_name);
         image = result[0].uploaded_image;
         console.log("Image Name : "+result[0].uploaded_image);
         price = result[0].price;
         category = result[0].category;
       // description = result[0].description;

       
          db.query("SELECT * FROM cart WHERE product_name=? AND userid LIKE '"+email+"%'", [product_name], function(err, result){
            if (result.length > 0){
              //res.redirect('back');
              res.redirect('/cart');

            }else{

              var sql = "INSERT INTO cart (userid, product_name, image, price, category, quantity) VALUES ('"+email+"','"+product_name+"','"+image+"','"+price+"','"+category+"','1')";
              db.query(sql, function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('/cart');
                //res.redirect('back');
              });
            }
           });
          });     

  });





module.exports = router;

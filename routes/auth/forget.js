var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
let mailTransporter = nodemailer.createTransport({
  host: "mail.utsavdcs.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'your email address',
    pass: 'password'
  }
});

router.get('/', function(req, res, next) {
    var email = 'null';
    var userId = req.session.userId;
    if(userId != null){
      res.render('index',{message : '', messagefail:'! Before resetting your password, You need to Signout first.', messageout:'', code:'', nav:'1'});
      return;
    }
  res.render('forget',{emailbox:'1', codebox:'', passbox:'',email:email, message:''});
});

router.post('/', function(req, res, next) {

    var email = req.body.email;
    var userId = req.session.userId;

    if(userId != null){
      res.render('index',{message : '', messagefail:'! Before resetting your password, You need to Signout first.', messageout:'', code:''});
      return;
    }


    var code = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    let mailDetails = {
      from: 'your email address',
      to: email,
      subject: 'Utsavdcs code',
      html: '<h1>Your code is '+code+'</h1>'
    };

        async function myEmail() {
        await  mailTransporter.sendMail(mailDetails, function(err, data) {
            if(err) {
                console.log('Error Occurs');
            } else {
                console.log('Email sent successfully');
            }
          });
        }


    db.query('SELECT * FROM users WHERE email=?', [email], function (error, results, fields) {
        if (results.length > 0){
          myEmail();
            var sql = "UPDATE users SET code = ? WHERE email = ?";
            db.query(sql,[code, email], function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.render('forget',{emailbox:'', codebox:'1', passbox:'', email:email, message:''});               // res.end();
            });

         }else{
            res.render('index',{message : '', messagefail:' "'+email+'" This email is not registered with us. You can Register with this email.', messageout:'', email:email, nav:''});
         }

        });
});

// Code checking
router.post('/codecheck', function(req, res, next) {


     var email = req.body.email;
     var code = req.body.code;
     var userId = req.session.userId;

     if(userId != null){
       res.render('index',{message : '', messagefail:' Before Making another account you need to Signout first.', messageout:'', code:'', nav:''});
       return;
     }

     db.query('SELECT * FROM users WHERE email=? AND code=?', [email, code], function (error, results, fields) {
         if (results.length > 0){

            res.render('forget',{emailbox:'', codebox:'', passbox:'1', email:email, message:''});
         }else{

            res.render('forget',{emailbox:'', codebox:'1', passbox:'', email:email, message:' You have entered wrong code.'});
          }

         });
 });

 // reset password
router.post('/resetpass', function(req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    var userId = req.session.userId;



    if(userId != null){
      res.render('index',{message : '', messagefail:' Before resetting your password, you need to Signout first.', messageout:'', code:'', nav:''});
      return;
    }

    db.query('SELECT * FROM users WHERE email=?', [email], function (error, results, fields) {
        if (results.length > 0){
            var sql = "UPDATE users SET pass = ?, register = 1 WHERE email = ?";
            db.query(sql,[password, email], function(err, result) {
                if (err) throw err;
                res.render('index',{ message: '', messagefail:'', messageout:' Your password has Reset Successully.', code:'', nav:''});               // res.end();
            });

        }else{
            res.render('index',{ message: '', messagefail:' Some Error Found Please Try Again.', messageout:'', code:'', nav:''});
         }

        });
});

module.exports = router;

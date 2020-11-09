var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');


let mailTransporter = nodemailer.createTransport({
  host: "mail.utsavdcs.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'your email address',
    pass: 'password'
  }
});


router.post('/', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var userId = req.session.userId;
  if(userId != null){
    res.render('index',{message : '', messagefail:' Before Making another account you need to Signout first.', messageout:'', nav:'1',code:''});
    return;
  }

  var code = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
  let mailDetails = {
    from: 'your email address',
      to: email,
      subject: 'Utsavdcs verification code',
      html: '<h3>Your code is </h3>'+code+' <p>Please do not share this code with anyone else.</p>'
  };

      async function myEmail() {
        mailTransporter.sendMail(mailDetails, function(err, data) {
          if(err) {
              console.log('Error Occurs');
          } else {
              console.log('Email sent successfully');
          }
        });
      }



    console.log();

    db.query('SELECT * FROM users WHERE email=? AND register=1', [email, password], function (error, results, fields) {
      if (results.length > 0){
        res.render('index',{message : '', messagefail:'', messageout:' This email is already registered with us, you can Signin with this email.', code:'', nav:''});
      }else{
        db.query('SELECT * FROM users WHERE email=? AND pass=? AND register=0', [email, password], function (error, results, fields) {
          if (results.length > 0){
            myEmail();
            db.query("UPDATE users SET code=? WHERE email=?",[code,email], function(err, result) {
              if(err) throw err;
              console.log("1 record inserted");
             res.render('code',{messagefail:'', messageout:' This email is already registered with us, Please verify your email. We have sent you 6-digit code.', code : email});
            });
          } else{
            db.query('SELECT * FROM users WHERE email=? AND register=0', [email], function (error, results, fields) {
              if (results.length > 0){
                myEmail();
                db.query("UPDATE users SET code=?, pass=? WHERE email=?",[code, password, email], function(err, result) {
                  if(err) throw err;
                  console.log("1 record inserted");
                 res.render('code',{messagefail:'', messageout:' '+email+' Please verify your email. We have sent you 6-digit code.', code : email});
                });
              }else{
                myEmail();
                var sql = "INSERT INTO users (email,pass,code) VALUES ('" + email + "', '" + password + "', '" + code + "')";
                db.query(sql, function(err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    res.render('code',{ message : '', messagefail : '', messageout:' You Registered Successfully. Please verify your Acoount, We have sent you 6-digit code.', code : email});
                });
              }
        });
      }
   });
 }
});
});


module.exports = router;

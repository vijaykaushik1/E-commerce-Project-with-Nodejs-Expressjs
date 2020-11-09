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
    var userId = req.session.userId;

    if(userId != null){
      res.render('index',{message : '', messagefail:' Before Making another account you need to Signout first.', messageout:'', code:'', nav:''});
      return;
    }


    var code = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    let mailDetails = {
      from: 'your email address',
      to: email,
      subject: 'utsavdcs code',
      html: '<h1>Your code is '+code+' </h1>'
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
            var sql = "UPDATE users SET code = ? WHERE register = ?";
            db.query(sql,[code, email], function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.render('code',{messagefail:'',messageout:' Please Re-check you email, We have sent you email.', code:email});
               // res.end();
            });

         }else{
            res.render('index',{message : '', messagefail:' Some Error found. Please try again.', messageout:'', code:email, nav:''});
         }

        });
});
module.exports = router;

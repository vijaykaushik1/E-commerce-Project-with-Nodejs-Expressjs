var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var session = require('express-session');
var multer = require('multer');
var fileUpload = require('express-fileupload');
var nodemailer = require('nodemailer');
var regex = require('regex');
var router = express.Router();
var flash = require('connect-flash');
var app = express();


var indexRouter = require('./routes/index');
var signinRouter = require('./routes/auth/signin');
var signupRouter = require('./routes/auth/signup');
var codeRouter = require('./routes/auth/code');
var signoutoutRouter = require('./routes/auth/signout');
var resendRouter = require('./routes/auth/resend');
var profileRouter = require('./routes/auth/profile');
var forgetRouter = require('./routes/auth/forget');
var productRouter = require('./routes/product');
var uploadRouter = require('./routes/admin/upload_product');
var cartRouter = require('./routes/cart');
var adminRouter = require('./routes/admin/admin');
var product_detailsRouter = require('./routes/products/product_details');
var payRouter = require('./routes/pay');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact/contact');
var servicesRouter = require('./routes/services');









// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/images/upload_images')));
app.use(fileUpload());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard dhaniban',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 } // maxAge : millisecond,   {1 second = 1000 millisecond}
}))

app.use(flash());

// MySQL connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

con.connect();
global.db = con;



app.use('/', indexRouter);
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/signout', signoutoutRouter);
app.use('/forget', forgetRouter);
app.use('/codecheck', forgetRouter);
app.use('/resetpass', forgetRouter);
app.use('/code', codeRouter);
app.use('/resend', resendRouter);
app.use('/profile', profileRouter);
app.use('/admin', adminRouter);
app.use('/adminsignout', adminRouter);
app.use('/upload_product', uploadRouter);
app.use('/product', productRouter);
app.use('/category', productRouter);
app.use('/cart', cartRouter);
app.use('/remove', cartRouter);
app.use('/product_details', product_detailsRouter);
app.use('/data', payRouter);
app.use('/pay', payRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/services', servicesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

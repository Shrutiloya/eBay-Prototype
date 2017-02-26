var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , home = require('./routes/home')
  , path = require('path')
  , userInfo = require('./routes/userInfo');
var mongo = require("./routes/mongo");
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
var mongoSessionURL = "mongodb://localhost:27017/ebay";
app.use(session({
  cookie: { maxAge: 1000*60*20 } ,
  secret: "cmpe273_test_string" ,
  resave: false,
  saveUninitialized: false,
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 10 * 60 * 1000,
  store:new MongoStore({
    url: mongoSessionURL

  })
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
require('./routes/passport')(passport);



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.use(app.router);
app.use(passport.initialize());






app.post('/lsignin', function(req, res, next) {
  passport.authenticate('afterSignIn', function(err, results, info) {
    if(err) {
      return next(err);
    }

    if(!results)
    {
      console.log("Invalid Login");
      json_responses = {"statusCode": 401};
      res.send(json_responses);

    }

    req.logIn(results, {session:false}, function(err)
    {

      if(err)
      {
        console.log("Invalid Login");
        json_responses = {"statusCode": 401};
        res.send(json_responses);
        return next(err);

      }
      console.log("valid Login");
      req.session.username = results.username;
      req.session.firstname=results.firstname;
      req.session.lastLoggedIn = results.lastLoggedIn;
      req.session.cartitems = [];
      req.session.total = parseFloat('0');
      res.send({"login":"Success"});

      return res.render('successLogin', {username:user.username,lastLoggedIn: req.session.lastLoggedIn});
    })
  })(req, res, next);
});

app.get('/lsignin', isAuthenticated, function(req, res) {
  res.render('successLogin',{username:req.session.username,lastLoggedIn:new Date().toLocaleString()});
});

function isAuthenticated(req, res, next) {
  if(req.session.username) {
    console.log(req.session.username);
    return next();
  }

  res.redirect('/');
};

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.get('/', routes.index);

app.get('/signin',home.sign_in);
app.post('/signin', home.after_sign_in);
app.get('/successLogin', home.success_login);
app.get('/fail_login', home.fail_login);
app.post('/afterRegister',home.register);
app.get('/getregisterProfile', home.getregisterProfile);
app.post('/afterProfileRegister', home.afterProfileRegister);
app.get('/getShopItems', home.getShopItems);
app.get('/getMyColletion',userInfo.getMyColletion);
app.get('/getMyBoughtItems',userInfo.getMyBoughtItems);
app.post('/addToCart',userInfo.addToCart);
app.post('/deleteFromCart',userInfo.deleteFromCart);
app.get('/getCart',userInfo.getCart);
app.get('/getCreateAd', userInfo.getCreateAd);
app.post('/afterCreatingAD', userInfo.afterCreatingAD);
app.get('/checkout', userInfo.checkout);
app.post('/checkoutAndProceed',userInfo.checkoutAndProceed);
app.post('/submitOffer',userInfo.submitOffer);
app.post('/logout', function(req,res) {
  req.session.destroy();
  res.redirect('/signin');
});


mongo.connect(mongoSessionConnectURL, function(){
  console.log('Connected to mongo at: ' + mongoSessionConnectURL);
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
});


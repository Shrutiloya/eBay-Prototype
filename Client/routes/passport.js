var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var ejs = require("ejs");
var mq_client = require('../rpc/client');
var home= require('./home');

module.exports = function(passport) {
    passport.use('afterSignIn', new LocalStrategy(function(username, password, done) {

          process.nextTick(function()
          {
              var msg_payload = { "operation":"login", "username": username, "password": home.encrypt(password) };
              console.log("In POST Request = UserName:"+ username+" "+password);
              mq_client.make_request('login_queue',msg_payload, function(err,results){
                  console.log(results);
                  if(err){
                      throw err;
                  }
                  else
                  {

                      if(results.code == 200)
                      {
                          console.log("***TRUE***");
                          done(null, results);

                      }
                      else
                      {
                          console.log("****FALSE******");
                          done(null, false);
                      }
                  }

              });

            });
        }));

}



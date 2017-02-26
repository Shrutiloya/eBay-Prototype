var ejs = require("ejs");
var fs = require('fs');
var crypto = require('crypto'),
	algorithm = 'aes-256-ctr',
	password = 'd6F3Efeq';
var soap = require('soap');
var baseURL = "http://localhost:8080/testebay/services";

function writeLogFile(data)
{
	fs.appendFile("./public/logs/EventLog1", data+"\n", encoding='utf8', function (err) {
		if (err) throw err;
	});
}

function encrypt(text)
{
	var cipher = crypto.createCipher(algorithm,password)
	var crypted = cipher.update(text,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}
function sign_in(req,res) {

	ejs.renderFile('./views/signin.ejs',function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
}


function register(req,res)
{
		var	username = req.param("username");
		var password= encrypt(req.param("password"));
		var firstname= req.param("firstname");
		var lastname=req.param("lastname");



	var option = {
		ignoredNamespaces: true
	};
	var url = baseURL + "/testsignup?wsdl";
	console.log("**********", url);
	var args = {username: username, password: password, firstname: firstname, lastname: lastname};
	soap.createClient(url, option, function (err, client) {
		client.signup(args, function (err, result) {

			if (result.signupReturn == 200) {
				console.log("valid Login");

				res.send({"login": "Success"});
			}


		});
	});
}

function renderToHomepage(res, req)
{
	var data = new Date().toLocaleString()+", "+req.session.username+", home, HOMEPAGE";
	writeLogFile(data);

	res.render("successLogin", {username: req.session.firstname, lastLoggedIn: req.session.lastLoggedIn});
}
function success_login(req,res) {
	renderToHomepage(res, req);
}


function fail_login(req,res)
{
	ejs.renderFile('./views/fail_login.ejs',function(err, result) {
        // render on success
        if (!err) {
            res.end(result);
        }
        // render or error
        else {
            res.end('An error occurred');
            console.log(err);
        }
    });
}


function after_sign_in(req,res)
{

	var username = req.param("username");
	var password = encrypt(req.param("password"));
	console.log("In POST Request = UserName:"+ username+" "+password);

	var option = {
		ignoredNamespaces: true
	};
	var url = baseURL + "/testlogin?wsdl";
	console.log("**********", url);
	var args = {username: username, password: password};
	soap.createClient(url, option, function (err, client) {
		client.validate(args, function (err, result)
		{
			if(err){

				console.log("Invalid Login");
				res.send({"login":"Fail"});

			}
			else {
				var results =result.validateReturn;

				console.log("***********RESULT**********", results.username);
				req.session.username = results.username;
				req.session.firstname = results.firstname;
				req.session.lastLoggedIn = results.lastLoggedIn;
				req.session.cartitems = [];
				req.session.total = parseFloat('0');
				res.send({"login": "Success"});
			}

		})
	});

}


exports.getregisterProfile=function(req,res)
{
	var data = new Date().toLocaleString()+", "+req.session.username+", userProfile, USER PROFILE";
	writeLogFile(data);
	res.render("userprofile",{username:req.session.firstname,userhandle:'',userbirthdate:'',userphone: '', useraddress: '', buttonname:"Register Profile",lastLoggedIn: req.session.lastLoggedIn});

}




exports.afterProfileRegister= function(req,res)
{
	var option = {
		ignoredNamespaces: true
	};
	var url = baseURL + "/registerprofile?wsdl";
	console.log("**********", url);
	var args = {username: req.session.username, birthdate: req.param("birthdate"), phoneno: req.param("contact"), address: req.param("address"),ebayhandle : req.param("handle")};
	soap.createClient(url, option, function (err, client) {
		client.saveprofile(args, function (err, result) {

			if (result.saveprofileReturn == 200) {
				console.log("valid Login");

				renderToHomepage(res,req);
			}


		});
	});



}



exports.getShopItems=function(req,res)
{
	var username = req.session.username;
	var data = new Date().toLocaleString()+", "+req.session.username+", shop, Opening the Shopping Main Page";
	writeLogFile(data);


	var option = {
		ignoredNamespaces: true
	};
	var url = baseURL + "/shopitems?wsdl";
	console.log("**********", url);
	var args = {username: username};
	soap.createClient(url, option, function (err, client) {
		client.getitems(args, function (err, result)
		{
			if(err){

				res.render("shopItems",{username:req.session.firstname,data:"",lastLoggedIn: req.session.lastLoggedIn});
			}
			else
			{
				var results =result.getitemsReturn;
				req.session.shopitems= results;
				res.render("shopItems",{username:req.session.firstname,data:results,lastLoggedIn: req.session.lastLoggedIn});

			}

		})
	});


};



exports.sign_in=sign_in;
exports.after_sign_in=after_sign_in;
exports.success_login=success_login;
exports.fail_login=fail_login;
exports.register=register;
exports.writeLogFile=writeLogFile;
exports.encrypt=encrypt;
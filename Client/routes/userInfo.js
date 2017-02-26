var ejs = require("ejs");
var home= require('./home');
var mongo= require('./mongo');
var fs= require('fs');
var soap = require('soap');
var baseURL = "http://localhost:8080/testebay/services";
var ObjectId = require('mongodb').ObjectID;

exports.getMyColletion =function(req,res)
{
    var data = new Date().toLocaleString()+", "+req.session.username+", myCollection, Getting Details of the Users Own Posts";
    home.writeLogFile(data);


    var option = {
        ignoredNamespaces: true
    };
    var url = baseURL + "/userItemTransaction?wsdl";
    console.log("**********", url);
    var args = {username: req.session.username};
    soap.createClient(url, option, function (err, client) {
        client.getMyCollection(args, function (err, result)
        {
            if(err){

                res.render("userInventory",{username:req.session.firstname,data:"", message:"No Data Found",lastLoggedIn: req.session.lastLoggedIn});
            }
            else
            {
                var collection =result.getMyCollectionReturn;

                res.render("userInventory",{username:req.session.firstname,data:collection, message:"",lastLoggedIn: req.session.lastLoggedIn});

            }

        })
    });



};



exports.getMyBoughtItems =function(req,res)
{
    var data = new Date().toLocaleString()+", "+req.session.username+", boughtItems, Getting details of the User's Bought items";
    home.writeLogFile(data);


    mongo.collection('purchase').find({username: req.session.username}).toArray(function (err, result) {
        for (var i = 0; i < result.length; i++) {
            ids.push(result[i].itemid);
        }
    });

    var option = {
        ignoredNamespaces: true
    };
    var url = baseURL + "/userItemTransaction?wsdl";
    console.log("**********", url);
    var args = {username: req.session.username};
    soap.createClient(url, option, function (err, client) {
        client.getMyBoughtItems(args, function (err, result)
        {
            if(err){

                res.render("userBoughtItems", {
                    username: req.session.firstname,
                    data: "",
                    message: "No Data Found",
                    lastLoggedIn: req.session.lastLoggedIn
                });
            }
            else
            {
                var collection =result.getMyBoughtItemsReturn;

                res.render("userBoughtItems", {username: req.session.firstname,data: collection,message: "",lastLoggedIn: req.session.lastLoggedIn});

            }

        })
    });


}


exports.addToCart=function(req,res)
{

    if(typeof (req.param("addToCart")) != 'undefined')
    {
        var data1 = new Date().toLocaleString()+", "+req.session.username+", addToCart, Adding the item to the Cart";
        home.writeLogFile(data1);

        var data = {"itemname": req.param("itemname"), "price": req.param("price"), "itemid": req.param("itemid"),"ownerId":req.param("userId"),"quantity":req.param("quantity")};
        req.session.total +=parseFloat(req.param("price"));
        req.session.cartitems.push(data);
        res.render("shopItems", {username: req.session.firstname, data: req.session.shopitems,lastLoggedIn: req.session.lastLoggedIn});
    }
    else
    {
        var data = new Date().toLocaleString()+", "+req.session.username+", bid, Making a Bid for the Item";
        home.writeLogFile(data);
        res.render("makeOffer", {"productname":req.param("itemname"),"productId":req.param("itemid"),"productPrice":req.param("price")});

    }

};

exports.getCart=function(req,res)
{
    var data = new Date().toLocaleString()+", "+req.session.username+", getCart, Displaying the User Cart";
     home.writeLogFile(data);
    res.render("cart",{username:req.session.firstname,cartitems:req.session.cartitems,total: req.session.total,finaltotal:req.session.total+2,lastLoggedIn: req.session.lastLoggedIn});

};


exports.deleteFromCart=function(req,res)
{
     var data = new Date().toLocaleString()+", "+req.session.username+", deleteFromCart, Deleting the item from the Cart";
     home.writeLogFile(data);
    var index= req.param("itemid");
    req.session.total = req.session.total - parseFloat(req.session.cartitems[index].price);
    req.session.cartitems.splice(index,1);
    res.render("cart",{username:req.session.firstname,cartitems:req.session.cartitems,total: req.session.total,finaltotal:req.session.total+2,lastLoggedIn: req.session.lastLoggedIn});

};





exports.submitOffer=function(req,res)
{
    var data = new Date().toLocaleString()+", "+req.param("itemid")+", "+req.session.username+", $"+req.param("bidAmount");
    writeBiddingLogFile(data);

    var option = {
        ignoredNamespaces: true
    };
    var url = baseURL + "/submitBid?wsdl";
    console.log("**********", url);
    var args = {username: req.session.username, productid: req.param("itemid"),
        bidDate:new Date().toLocaleString(), bidAmount: req.param("bidAmount")};


    soap.createClient(url, option, function (err, client) {
        client.submitOffer(args, function (err, result) {

            if (result.submitOfferReturn == 200)
            {
                json_responses = {"statusCode" : 200};
                res.send(json_responses);
            }
            else
            {
                json_responses = {"statusCode" : 401};
                res.send(json_responses);
            }


        });
    });

};




exports.getCreateAd=function(req,res)
{
    var data = new Date().toLocaleString()+", "+req.session.username+", createAD, To Sell any product";
    home.writeLogFile(data);
    res.render("createAd",{username:req.session.firstname,sucessMsg:'',lastLoggedIn: req.session.lastLoggedIn});

};




exports.afterCreatingAD=function(req,res)
{
   var data = new Date().toLocaleString()+", "+req.session.username+", postAD, Posting the advertisement";
    home.writeLogFile(data);
    var canBid;
    if(req.param("canBid") == "on")
        canBid = "visible";
    else
        canBid = "hidden";


    var option = {
        ignoredNamespaces: true
    };
    var url = baseURL + "/savePost?wsdl";
    console.log("**********", url);
    var args = {username: req.session.username, itemname: req.param("itemname"),
                itemdesc: req.param("itemdesc"), sellerinfo: req.param("sellerinfo"),
                price : req.param("price"),quantity : req.param("quantity"),isBid:canBid,image:req.param("pic")};
    soap.createClient(url, option, function (err, client) {
        client.savepost(args, function (err, result) {

            if (result.saveprofileReturn == 200)
            {
                res.render("createAd",{username:req.session.firstname,sucessMsg:'ADD CREATED SUCESSFULLY',lastLoggedIn: req.session.lastLoggedIn});

            }
            else
            {
                res.render("createAd",{username:req.session.firstname,sucessMsg:'ADD CREATION FAILED..Please try again!!',lastLoggedIn: req.session.lastLoggedIn});

            }


        });
    });




}

exports.checkout=function(req,res)
{
   var data = new Date().toLocaleString()+", "+req.session.username+", checkOut, Proceeding with the CheckOut";
    home.writeLogFile(data);
    res.render("checkout", {finaltotal: req.session.total + 2});
};


exports.checkoutAndProceed=function (req, res)
{
    var data = new Date().toLocaleString()+", "+req.session.username+", buy, Final payment";
    home.writeLogFile(data);
    var json_responses;

    var cvvformat =/^[0-9]{3,4}$/;
    var ccformat=/^\d{16}$/;



    if (req.param("cardno").search(ccformat)==-1 ||  req.param("securitycode").search(cvvformat)==-1)
    {
        console.log("Invalid number");
        json_responses = {"statusCode" : 401};
        res.send(json_responses);

    }
    else {
        var productIds = {};
        for (var i = 0; i < req.session.cartitems.length; i++) {
            productIds.push(new ObjectId(req.session.cartitems[i].itemid));
        }

        var option = {
            ignoredNamespaces: true
        };
        var url = baseURL + "/userItemTransaction?wsdl";
        console.log("**********", url);
        var args = {username: req.session.username, productid: productIds};
        soap.createClient(url, option, function (err, client) {
            client.checkout(args, function (err, result) {

                if (result.checkoutReturn == 200) {
                    req.session.cartitems = [];
                    req.session.total = parseFloat('0');
                    json_responses = {"statusCode": 200};
                    res.send(json_responses);
                }
                else {
                    json_responses = {"statusCode": 401};
                    res.send(json_responses);
                }


            });
        });
    }


};


function writeBiddingLogFile(data)
{
    fs.appendFile("./public/logs/BiddingLog", data+"\n", encoding='utf8', function (err) {
        if (err) throw err;
    });
}
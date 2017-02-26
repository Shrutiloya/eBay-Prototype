var assert = require('assert');
var home= require('./home');
var request = require('supertest');
var http = require('http');

describe('test1', function()
{
    var encrypted= home.encrypt("sa");
    it('Check Encryption', function(){
        assert.equal(encrypted,"178f");
    });
})

describe('test2', function()
{
    it('should be able to login', function(done)
    {
        http.get('http://localhost:3000/successLogin',function(res){
            assert.equal(200,res.statusCode);
            done();
        })
    });
})

describe('test3', function()
{
    it('should be able to add shipping details', function(done)
    {
        http.get('http://localhost:3000/getregisterProfile',function(res){
            assert.equal(200,res.statusCode);
            done();
        })
    });
})

describe('test4', function()
{
    it('should be able to get users inventory', function(done)
    {
        http.get('http://localhost:3000/getregisterProfile',function(res){
            assert.equal(200,res.statusCode);
            done();
        })
    });
})

describe('test5', function()
{
    it('should be able to get user profile', function(done)
    {
        http.get('http://localhost:3000/getregisterProfile',function(res){
            assert.equal(200,res.statusCode);
            done();
        })
    });
})
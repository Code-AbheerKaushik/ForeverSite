const Router = require("express").Router();
const {loginvalidation, signupvalidation} = require("./middlewares/validation");
const {login, signup, getuser} = require("./auth");
Router.post('/login',loginvalidation,login);
Router.post('/signup',signupvalidation,signup);
Router.get('/getuser',getuser);
module.exports = Router;
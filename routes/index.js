var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");    

//root route
router.get("/",(req,res)=>{
    res.render("landing");
}); 



//register form route
router.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to Gujarat Hikes" + user.username);
                res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login",function(req,res){
    // res.render("login",{message: req.flash("error")}); instead I have set res.locals
    res.render("login");
});

//handling login logic
//ref:#3344[app.js]
router.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash: true
    }),function(err,user,info){
    //no need
});

//logout route
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});


module.exports = router;
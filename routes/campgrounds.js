var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//INDEX
router.get("/",(req,res)=>{ 
   // console.log(req.user);
   Campground.find({},function(err,allCampgrounds){
       if(err){
           console.log(err);
       }
       else{
           res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
   });
});

//NEW
router.get("/new",isLoggedIn,(req,res)=>{
   res.render("campgrounds/new");
});

//CREATE
router.post("/",isLoggedIn,(req,res)=>{
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newCampground = {
                       name:name,
                       image:image,
                       description: desc,
                       author: author 
                       };
   
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       }
       else{
        // console.log("========="+ res.locals.currentUser.username);
        // newlyCreated.author.id = req.user._id;
        // newlyCreated.author.username = req.user.username;
        // newlyCreated.save();
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
   });    
});

//SHOW 
router.get("/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       } else{
           console.log(foundCampground);
           res.render("campgrounds/show",{campground: foundCampground});
       }
   });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){

        if(err){
            console.log(err);
        }else{
            // console.log(foundCampground);
            res.render("campgrounds/edit", {campground: foundCampground});        
        }

    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",isLoggedIn, function(req,res){
   
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){

        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }

    });
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id",isLoggedIn,function(req,res){
    
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });

});

//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;

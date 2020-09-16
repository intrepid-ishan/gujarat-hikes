var express = require("express");
var router  = express.Router({mergeParams: true});//#mergeParams
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments NEW 
router.get("/new",middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    });
});

//Comments CREATE
router.post("/",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
           Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
 });

//Comments EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){

    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("back");
        }else{
            Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    console.log("back");
                }else{
                    // console.log(foundCampground);
                    res.render("comments/edit", {comment:foundComment, campground:foundCampground});
                }
            });    
        }
    });
});

//Comments UPDATE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment ,function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);//:| /campgrounds
        }
    });
});

//Comments DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
        Comment.findByIdAndRemove(req.params.comment_id,function(err){
            if(err){
                res.redirect("back");
            }else{
                res.redirect("/campgrounds/"+req.params.id);
            }
        });
});



module.exports = router;
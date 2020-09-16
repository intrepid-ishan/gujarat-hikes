var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.flash("error","You don't have permission");  
                    res.redirect("back");
                }
            }
        });
    }else{
        res.flash("error","You need to be logged In to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","Please login first!!");//key,value $_SESSION['key']="value";
        res.redirect("/login");
    }
}


module.exports = middlewareObj;
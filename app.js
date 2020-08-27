var  express    = require("express"),
     app        = express(),
     bodyParser = require('body-parser'),
     mongoose   = require("mongoose"),
     passport   = require("passport"),
     LocalStrategy = require("passport-local"),
     Campground = require("./models/campground"),
     seedDB     = require("./seeds"),
     Comment    = require("./models/comment"),
     User       = require("./models/user");

seedDB();

// PASSPORT CONGFIGURATION
app.use(require("express-session")({
    secret: "this can be anything",
    resave: false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//#3344 here[authenticate method came with passportLocalMongoose]
//Therefore, it will enable use of passport.authenticate
//if !plugin then will needed to write authenticate function manually
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/gujarat-hikes",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

// //MiddleWare
// //called before everyroute
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();//:|
});


app.get("/",(req,res)=>{
     res.render("landing");
}); 

//INDEX
app.get("/campgrounds",(req,res)=>{ 
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
app.get("/campgrounds/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});

//CREATE
app.post("/campgrounds",isLoggedIn,(req,res)=>{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {
                        name:name,
                        image:image,
                        description: desc
                        };
    
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });    
});

//SHOW - shows more info about one campground   
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground: foundCampground});
        }
    });
});


//================
// COMMENTS ROUTES
//================

//NEW
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req,res){
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground: campground});
        }
    });
});

//CREATE
app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
 });

//================
// AUTH ROUTES
//================

//register form
app.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
app.post("/register",function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
            passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login",function(req,res){
    res.render("login");
});
 
//handling login logic
//ref:#3344 up
app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req,res){
    //no need
});

//logout route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});


//middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, ()=>{
    console.log("Gujarat Hikes Server has started!");
});
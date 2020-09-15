var  express    = require("express"),
     app        = express(),
     bodyParser = require('body-parser'),
     mongoose   = require("mongoose"),
     passport   = require("passport"),
     LocalStrategy = require("passport-local"),
     Campground = require("./models/campground"),
     methodOverride = require("method-override"),
     seedDB     = require("./seeds"),
     Comment    = require("./models/comment"),
     User       = require("./models/user");



//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

app.use(methodOverride("_method"));//PUT,DELETE

seedDB();

// PASSPORT CONGFIGURATION
app.use(require("express-session")({
    secret: "this can be anything",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//#3344[authenticate method came with passportLocalMongoose]..
passport.serializeUser(User.serializeUser());//..Therefore, it will enable use of passport.authenticate avoiding to type manually
passport.deserializeUser(User.deserializeUser());



mongoose.connect("mongodb://localhost:27017/gujarat-hikes",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));



//middleware[res.locals]
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    // console.log(res.locals.currentUser);
    next();//:|
});



app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);//append
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(3000, ()=>{
    console.log("Gujarat Hikes Server has started!");
});
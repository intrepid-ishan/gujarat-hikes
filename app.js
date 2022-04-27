var  express    = require("express"),
     app        = express(),
     bodyParser = require('body-parser'),
     mongoose   = require("mongoose"),
     flash      = require("connect-flash"),
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
app.use(flash());
seedDB();

// PASSPORT CONGFIGURATION
app.use(require("express-session")({
    secret: "2318ifnf@#$FAF",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//ref:#3344 authenticate method came with passportLocalMongoose (refer models/user.js)
passport.serializeUser(User.serializeUser());//..Therefore, it will enable use of passport.authenticate
passport.deserializeUser(User.deserializeUser());


// export DATABASEURL=mongodb://localhost:27018/gujarat-hikes
//for heroku set key,value
var url = process.env.DATABASEURL || "mongodb://localhost:27018/gujarat-hikes";
mongoose.connect(url,
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Connected to DB!');
}).catch(err => {
    console.log('ERROR:',err.message);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));



//middleware[res.locals]
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success");
    //whenever req.flash with key=error isset it will be available here
    next();
});



app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);//append
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT || 3000, ()=>{
    console.log("Gujarat Hikes Server has started!");
});
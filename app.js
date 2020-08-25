var  express    = require("express"),
     app        = express(),
     bodyParser = require('body-parser'),
     mongoose   = require("mongoose"),
     Campground = require("./models/campground"),
     seedDB     = require("./seeds");


seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");


// Campground.create(
//     {
//         name:"Polo Forest",
//         image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//         description: "Located in Gujarat!"
//     },
//     function(err,campground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("Newly Created Campground");
//             console.log(campground);
//         }
//      });


app.get("/",(req,res)=>{
     res.render("landing");
}); 

app.get("/campgrounds",(req,res)=>{ 
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{campgrounds:allCampgrounds});
        }
    });
});

app.post("/campgrounds",(req,res)=>{
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

app.get("/campgrounds/new",(req,res)=>{
    res.render("new");
});

//SHOW - shows more info about one campground   
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
            res.render("show",{campground: foundCampground});
        }
    });
});


app.listen(3000, ()=>{
    console.log("Yelp Camp Server has started!");
});
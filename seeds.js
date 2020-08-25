var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");


var seeds = [
    {
        name: "Kedarkantha",
        image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    },
    {
        name: "Roopkund",
        image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    },
    {
        name: "Polo Forest",
        image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah blah"
    }
];

//to get rid of callback hell
async function seedDB() {

    try {
        await Comment.remove({});
        console.log("comment removed");
        await Campground.remove({});
        console.log("campground removed");

        for (const seed of seeds) {
            let campground = await Campground.create(seed);
            console.log("campground created");
            let comment = await Comment.create(
                {
                    text: "This place is great",
                    author: "Homer"
                }
            );
            console.log("comment created");
            campground.comments.push(comment);
            campground.save();
            console.log("comment added to campground");
        }
    } catch (err) {
        console.log(err);
    }


}

module.exports = seedDB;
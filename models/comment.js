var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    
    author: { //#one_to_one  [one comment can have one author]
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }

});

module.exports = mongoose.model("Comment",commentSchema);

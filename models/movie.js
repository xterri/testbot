// create movies db model
// storing user's last searched movie (only 1 record per user)
var mongoose    =   require("mongoose");
var Schema      =   mongoose.Schema;

var MovieSchema =   new Schema({
    user_id: {type: String}, // user's ID from messenger platform
    title: {type: String},
    plot: {type: String},
    date: {type: String},
    runtime: {type: String},
    director: {type: String},
    cast: {type: String},
    rating: {type: String},
    poster_url: {type: String}
});

module.exports  =   mongoose.model("Movie", MovieSchema);
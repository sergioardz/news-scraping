var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var HeadlineSchema = new Schema({
    // `title` is required and of type String
    headline: {
        type: String,
        required: true,
        unique: true
    },
    // `summary` is required and of type String
    summary: {
        type: String,
        required: true
    },
    // `link` is required and of type String
    url: {
        type: String,
        required: true
    },
    // `saved` is set to false by default
    saved: {
        type: Boolean,
        default: false
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
});

// This creates our model from the above schema, using mongoose's model method
var Headline = mongoose.model("Headline", HeadlineSchema);

// Export the Article model
module.exports = Headline;
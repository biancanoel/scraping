var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    headline: {
        type: String,
        required: true
    }, 
    link: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    saved: {
        type: Boolean,
        default: false,
        required: true
    },
    hasComment: {
        type: Boolean,
        default: false,
       
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports= Article;
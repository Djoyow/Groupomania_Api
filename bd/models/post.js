const mongoose = require('mongoose')

const Post = mongoose.Schema({
    userId:{type:String,require:true},
    imageUrl:{type:String,require:true},
    likes:{type:Number},
    usersLiked:[String],
    text:{type:String,require:true},
    createOne: { type: Date, default: Date.now  }

})

module.exports = mongoose.model('Post', Post)

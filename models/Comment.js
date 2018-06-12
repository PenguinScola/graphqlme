import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
    content : String,
    postId : mongoose.Schema.Types.ObjectId,
    authorId :mongoose.Schema.Types.ObjectId
},{timestamp : true, versionKey : false})

module.exports = mongoose.model('Comment', commentSchema)

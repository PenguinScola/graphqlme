import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    title : String,
    content : String,
    tags : [String],
    authorId : mongoose.Schema.Types.ObjectId
},{timestamp : true, versionKey : false})

module.exports = mongoose.model('Post', postSchema)
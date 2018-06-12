import mongoose from 'mongoose'
import Post from './Post'
import User from './User'
import Comment from './Comment'

mongoose.connect('mongodb://localhost:27017/react_training')
mongoose.set('debug' , true)

const db = mongoose.connection

db.once('open', () => {
    console.log('connected DB')
})

module.exports = {
    Post, User, Comment
}

import { makeExecutableSchema } from 'graphql-tools'
import { Post, User, Comment } from './models'

const typeDefs = `
    type Query {
        post(id : ID!) : Post
        posts : [Post],
        user(id : ID!) : User
        users : [User]
        comment(id : ID!) : Comment
        comments : [Comment]
    }

    type Post {
        id : ID!
        tags : [String]
        title : String
        content : String
        author : User
        comments : [Comment]
    }

    type User {
        id : ID!
        username : String
        password : String
        posts : [Post]
    }

    type Comment {
        id : ID!
        content : String
        post : Post
        author : User
    }

    input PostData {
        title : String
        content : String
        tags : [String]
    }

    input CommentData {
        postId : String,
        content : String
    }

    type Mutation {
        signup(username : String!, password: String!) : User
        login(username : String!, password: String!) : String
        createPost(data : PostData!) : Post
        deletePost(postid : ID!) : String
        createComment(data : CommentData!) : Comment
        deleteComment(commentid : ID!) : String
    }
`
const resolvers = {
    Query : {
        post : async (obj, {id}) => {
            const post = Post.findOne({_id : id})
            return post
        },
        posts : async () => {
            const posts = await Post.find()
            return posts
        },
        user : async (obj, {id}) => {
            const user = await User.findOne({_id : id})
            return user
        },
        users : async () => {
            const users = await User.find()
            return users
        },
        comment : async (obj, {id}) => {
            const comment = await Comment.findOne({_id : id})
            return comment
        },
        comments : async () => {
            const comments = await Comment.find()
            return comments
        }
    },
    Post : {
        id : post => post._id,
        author : async (post) => {
            const user = await User.findOne({_id : post.authorId})
            return user
        },
        comments : async (post) => {
            const comments = await Comment.find({postId : post._id})
            return comments
        }
    },
    User : {
        id : user => user._id,
        posts : user => {
           return Post.find({authorId : user._id})
        }
    },
    Comment : {
        id : comment => comment._id,
        post : async (comment) => {
            const post = await Post.findOne({_id : comment.postId})
            return post
        },
        author : async (comment) => {
            const author = await User.findOne({id : comment.authorId})
            return author
        }
    },
    Mutation : {
        signup : async (obj, {username, password}) => {
            const user = await User.signup(username, password)
            return user
        },
        login : async (obj, {username, password}) => {
            const token = await User.createAccessToken(username, password)
            return token
        },
        createPost : async (obj, {data}, context) => {
            if(!context.user) {
                const e = new Error('Please login to post this')
                throw e
            }

            const input = {
                ...data,
                authorId : context.user._id
            }

            const post = await Post.create(input)
            return post
        },
        deletePost : async (obj, {postid}) => {
            const result = await Post.deleteOne({_id : postid})

            if(result.ok != 1) {
                const e = new Error("delete failed, please try again.")
                throw e
            }

            if(result.n == 0) {
                const e = new Error("this post does not exist.")
                throw e
            }
            
            return `postid : ${postid} deleted`
        },
        createComment : async (obj, {data}, context) => {
            if(!context.user) {
                const e = new Error('Please login to comment this')
                throw e
            }

            const input = {
                ...data,
                authorId : context.user._id
            }

            const comment = await Comment.create(input)
            return comment
        },
        deleteComment : async (obj, {commentid}) => {
            const result = await Comment.deleteOne({_id : commentid})

            if(result.ok != 1) {
                const e = new Error("delete failed, please try again.")
                throw e
            }

            if(result.n == 0) {
                const e = new Error("this comment does not exist.")
                throw e
            }

            return `commentid : ${commentid} deleted`
        }

    }

}

module.exports = makeExecutableSchema({
    typeDefs,
    resolvers
})
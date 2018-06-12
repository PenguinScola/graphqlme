import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const SECRET = "mysecret"

const hashpassword = (password) => {
    return crypto.createHmac('sha256', SECRET)
           .update(password)
           .digest('hex')
}

const userSchema = mongoose.Schema({
    username : String,
    password : String
},{timestamp : true, versionKey : false})

userSchema.statics.signup = async (username, password) => {
    const user = await test.findOne({username})

    if (user) {
        const e = new Error('Duplicated User')
        throw e
    }

    return test.create({
        username,
        password : hashpassword(password)
    })
}

userSchema.statics.createAccessToken = async (username, password) => {

    const user = await test.findOne({username})

    if (!user) {
        const e = new Error('Username does not exist')
    }

    return jwt.sign({username, password : hashpassword(password)}, SECRET)
}

userSchema.statics.verifyAccessToken = async (token) => {
    const verifytoken = await jwt.verify(token, SECRET)
    
    if (!verifytoken) {
       const e = new Error('Invalid Token')
    }

    const user = await test.findOne({username : verifytoken.username})
    return user
}

const test = mongoose.model('User', userSchema)

module.exports = test
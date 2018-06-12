import { User } from '../models'

const authMiddleware = async (req, res , next) => {
    const token = req.headers.authorization || req.query.token

    if (typeof token !== 'undefined') {
       // resolve token
       const user = await User.verifyAccessToken(token)
       req.user = user
    }

    next()
}

module.exports = authMiddleware
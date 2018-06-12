import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import schema from './schema'
import authMiddleware from './libs/auth'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(authMiddleware)

app.use('/graphql', graphqlExpress ((req) => ({
    schema,
    context : {
        user : req.user
    }
})))

app.use('/graphiql', graphiqlExpress({
    endpointURL : '/graphql'
}))

app.listen(8888)
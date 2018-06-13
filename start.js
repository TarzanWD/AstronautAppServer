import { MongoClient, ObjectId } from 'mongodb'
import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'

import _ from 'lodash'
import casual from 'casual'
import cors from 'cors'

import typeDefs from './data/types'

const URL = 'http://localhost'
const PORT = 7080
const MONGO_URL = 'mongodb://localhost:27017/test'

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL)
    
    const Astronauts = db.collection('astronauts')

    const resolvers = {
        Query: {
          astronauts: async (root) => {
            return await Astronauts.find({}).toArray()
          }
        },
        Mutation: {
          createAstronaut: async (root, args) => {
            const astronaut = {
              fname: args.fname,
              lname: args.lname,
              birthday: new Date(args.birthday),
              super: args.super
            }
            const res = await Astronauts.insert(astronaut)
            return res.ops[0]
          },
          deleteAstronaut: async (root, args) => {
            Astronauts.remove({_id: ObjectId(args._id) })
            return 'deleted'
          },
          updateAstronaut: async (root, args) => {
            let mutate = _.omit(args, '_id')
            console.log(mutate)
            await Astronauts.update({
              _id: ObjectId(args._id)
            },{
              $set:mutate
            })
            const res = await Astronauts.findOne({ _id: ObjectId(args._id )})
            console.log(res)
            return res
          }
        }
    }

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers
    })

    const app = express()

    app.use(cors())

    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}))

    const homePath = '/graphiql'

    app.use(homePath, graphiqlExpress({
      endpointURL: '/graphql'
    }))

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}${homePath}`)
    })

  } catch (e) {
    console.log(e)
  } 

}
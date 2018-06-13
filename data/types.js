import { Astronaut } from './models/astronaut'
import { Query } from './models/query'
import { Mutation } from './models/mutation'

const schema = `
  schema {
    query: Query
    mutation: Mutation
  }
`
const typeDef = [
  Astronaut,
  Query,
  Mutation,
  schema
]
export default typeDef
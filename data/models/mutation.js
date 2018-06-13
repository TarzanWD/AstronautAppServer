export const Mutation = `
  type Mutation {
    createAstronaut (fname: String!, lname: String!, birthday: String!, super: String!): Astronaut
    deleteAstronaut (_id: ID!): String
    updateAstronaut (_id: ID!, fname: String, lname: String, birthday: String, super: String): Astronaut
  }
`

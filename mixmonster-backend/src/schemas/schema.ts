export default /* GraphQL */`
    type Collection {
        id: String!
        title: String!
        allowReRoll: Boolean!
        categories: [Category!]!
    }
    
    type Category {
        title: String!
        selectable: Boolean!
        criteriaRollAmount: Int!
        criteria: [Criteria!]!
    }
    
    type Criteria {
        title: String!
        image: String
    }

    input CollectionInput {
        title: String!
        allowReRoll: Boolean = true
        categories: [CategoryInput!] = []
    }

    input CategoryInput {
        title: String!
        selectable: Boolean = true
        criteriaRollAmount: Int = 1
        criteria: [CriteriaInput!] = []
    }
    
    input CriteriaInput {
        title: String!
        image: String
    }
    
    type Query {
        getCollection(id: String!): Collection!
        getCollections: [Collection!]!
    }

    type Mutation {
        createCollection(input: CollectionInput!): Collection!
        updateCollection(id: String!, update: CollectionInput!): Collection!
        deleteCollection(id: String!): Boolean!
        deleteAllCollections: Boolean!
    }
`;

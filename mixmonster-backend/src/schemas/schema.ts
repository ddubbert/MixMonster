export default /* GraphQL */`
#    directive @entity(additionalFields: [AdditionalEntityFields], embedded: Boolean) on OBJECT
#    directive @column(overrideType: String) on FIELD_DEFINITION
#    directive @id on FIELD_DEFINITION
#    directive @link on FIELD_DEFINITION
#    directive @embedded on FIELD_DEFINITION
#    directive @map(path: String) on FIELD_DEFINITION
#    directive @abstractEntity(additionalFields: [AdditionalEntityFields], discriminatorField: String!) on INTERFACE
#    directive @union(discriminatorField: String) on UNION
#
#    input AdditionalEntityFields {
#        path: String!
#        type: String!
#    }

#    type User @entity(additionalFields: [{ path: "token", type: "string" }]) {
#        id: String @id
#        collections: [Collection] @link
#    }
#
#    type Collection @entity {
#        id: String! @id
#        title: String! @column
#        categories: [Category] @embedded
#    }
#
#    type Category @entity(embedded: true) {
#        title: String! @column
#        selectable: Boolean! @column
#        expressions: [Expression] @embedded
#    }
#
#    type Expression @entity(embedded: true) {
#        title: String! @column
#        image: String @column
#    }
#
#    type Query {
#        getUser: User!
#    }
    type User {
        id: String!
    }
    
    type Collection {
        id: String!
        title: String!
        allowReRoll: Boolean!
        categories: [Category]
    }
    
    type Category {
        title: String!
        selectable: Boolean!
        criteriaRollAmount: Int!
        criteria: [Criteria]
    }
    
    type Criteria {
        title: String!
        image: String
    }

    input CollectionInput {
        title: String!
        allowReRoll: Boolean = true
        categories: [CategoryInput]
    }

    input CategoryInput {
        title: String!
        selectable: Boolean = true
        criteriaRollAmount: Int = 1
    }
    
    input CriteriaInput {
        title: String!
        image: String
    }
    
    type Query {
        getUser: User!
        getUsers: [User]
        getCollection(id: String!): Collection!
        getCollections: [Collection]
    }

    type Mutation {
        deleteUsers: Boolean!
        createCollection(input: CollectionInput!): Collection!
        updateCollection(id: String!, update: CollectionInput!): Collection!
        deleteCollection(id: String!): Boolean!
        deleteAllCollections: Boolean!
    }
`;

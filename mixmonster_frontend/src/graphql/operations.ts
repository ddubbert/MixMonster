export default /* GraphQL */`
  fragment collectionData on Collection {
    id,
    title,
    allowReRoll,
    categories {
      title,
      selectable,
      criteriaRollAmount,
      criteria {
        showTitle,
        title,
        image
      }
    }
  }

  query getCollections {
    getCollections {
      ...collectionData
    }
  }

  query getCollection($id: String!) {
    getCollection(id: $id) {
      ...collectionData
    }
  }

  mutation createCollection($input: CollectionInput!) {
    createCollection(input: $input) {
      ...collectionData
    }
  }

  mutation updateCollection($id: String!, $update: CollectionInput!) {
    updateCollection(id: $id, update: $update) {
      ...collectionData
    }
  }

  mutation deleteCollection($id: String!) {
    deleteCollection(id: $id)
  }
`;

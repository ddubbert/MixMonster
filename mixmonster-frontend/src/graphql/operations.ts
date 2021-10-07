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
`;

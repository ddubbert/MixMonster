export default /* GraphQL */`
  query getCollections {
    getCollections {
      id,
      title,
      categories {
        title
      }
    }
  }
`;

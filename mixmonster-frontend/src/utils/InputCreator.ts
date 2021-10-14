import {
  CategoryInput,
  Collection, CollectionInput, CreateCollectionMutationVariables,
  UpdateCollectionMutationVariables,
} from '@/types/generated/graphql';

export function createInputFrom(collection: Collection): CollectionInput {
  const removeType = '__typename';
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [removeType]: collectionType,
    ...collectionUpdate
  } = collection;

  const categories: CategoryInput[] = collectionUpdate.categories.map((category) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [removeType]: categoryType, criteria: crit, ...categoryUpdate } = category;
    const criteria = crit.map((it) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [removeType]: criteriaType, ...criteriaUpdate } = it;
      return criteriaUpdate;
    });
    return { ...categoryUpdate, criteria };
  });

  return { ...collectionUpdate, categories };
}

export function getValidUpdate(collection: Collection): UpdateCollectionMutationVariables {
  return { id: collection.id, update: createInputFrom(collection) };
}

export function getValidCreate(collection: Collection): CreateCollectionMutationVariables {
  return { input: createInputFrom(collection) };
}

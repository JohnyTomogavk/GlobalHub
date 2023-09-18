export const tagSelectorValidator = (selectedTags?: number[]): Promise<void> => {
  if (selectedTags && selectedTags.length !== 0) return Promise.resolve();

  return Promise.reject();
};

import { EntityType } from '../enums/entityType';
import { BUDGET_DEFAULT_TITLE } from '../constants/budgetConstants';
import { NOTE_EMPTY_TITLE_PLACEHOLDER } from '../constants/notesConstants';

export const getUnnamedTitleByNodeType = (entityType: EntityType): string => {
  const entityTypeToTitleMappings = {
    [EntityType.Budget]: BUDGET_DEFAULT_TITLE,
    [EntityType.Note]: NOTE_EMPTY_TITLE_PLACEHOLDER,
  };

  return entityTypeToTitleMappings[entityType as keyof typeof entityTypeToTitleMappings];
};

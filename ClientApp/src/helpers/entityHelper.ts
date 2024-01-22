import { EntityType } from '../enums/entityType';
import { BUDGET_DEFAULT_TITLE } from '../constants/budgetConstants';
import { NOTE_EMPTY_TITLE_PLACEHOLDER } from '../constants/notesConstants';
import { PROJECT_DEFAULT_NAME } from '../constants/projectsConstants';

export const getUnnamedTitleByNodeType = (entityType: EntityType): string => {
  const entityTypeToTitleMappings = {
    [EntityType.Budget]: BUDGET_DEFAULT_TITLE,
    [EntityType.Note]: NOTE_EMPTY_TITLE_PLACEHOLDER,
    [EntityType.Project]: PROJECT_DEFAULT_NAME,
  };

  return entityTypeToTitleMappings[entityType as keyof typeof entityTypeToTitleMappings];
};

import React, { ReactNode } from 'react';
import { ProjectSearchItem } from '../models/fullTextSearch/projectSearchItem';
import { createSearchParams, Link } from 'react-router-dom';
import { getClientItemUrl } from './urlHelper';
import { BUDGET_RESOURCE_NAME, NOTE_RESOURCE_NAME, PROJECT_RESOURCE_NAME } from '../constants/resourceConstants';
import { ProjectItemSearchItem } from '../models/fullTextSearch/projectItemSearchItem';
import { BudgetSearchItem } from '../models/fullTextSearch/budgetSearchItem';
import { BudgetItemSearchItem } from '../models/fullTextSearch/budgetItemSearchItem';
import { NoteSearchItem } from '../models/fullTextSearch/noteSearchItem';
import { Flex } from 'antd';

export const renderProjectSearchResult = (model: ProjectSearchItem): React.ReactNode => {
  const clientUrl = getClientItemUrl(PROJECT_RESOURCE_NAME, model.projectId);

  return (
    <Flex justify={'space-between'} gap={'small'}>
      <Link to={clientUrl} type={'link'}>
        {model.title}
      </Link>
      <span dangerouslySetInnerHTML={{ __html: model.highlight ?? '' }} />
    </Flex>
  );
};

export const renderProjectItemSearchResult = (model: ProjectItemSearchItem): ReactNode => {
  const clientUrl = getClientItemUrl(PROJECT_RESOURCE_NAME, model.projectId);

  const destinationConfig = {
    pathname: clientUrl,
    search: createSearchParams({
      cameFromSearch: true.toString(),
      projectItemId: model.projectItemId.toString(),
    }).toString(),
  };

  return (
    <Flex justify={'space-between'} gap={'small'}>
      <Link to={destinationConfig}>{model.projectItemTitle}</Link>
      <span dangerouslySetInnerHTML={{ __html: model.highlight ?? '' }} />
    </Flex>
  );
};

export const renderBudgetSearchResult = (model: BudgetSearchItem): ReactNode => {
  const clientUrl = getClientItemUrl(BUDGET_RESOURCE_NAME, model.budgetId);

  return (
    <Flex justify={'space-between'} gap={'small'}>
      <Link to={clientUrl}>{model.title}</Link>
      <span dangerouslySetInnerHTML={{ __html: model.highlight ?? '' }} />
    </Flex>
  );
};

export const renderBudgetItemSearchResult = (model: BudgetItemSearchItem): ReactNode => {
  const clientUrl = getClientItemUrl(BUDGET_RESOURCE_NAME, model.budgetId);

  const destinationConfig = {
    pathname: clientUrl,
    search: createSearchParams({
      cameFromSearch: true.toString(),
      budgetItemId: model.budgetItemId.toString(),
    }).toString(),
  };

  return (
    <Flex justify={'space-between'} gap={'small'}>
      <Link to={destinationConfig}>{model.budgetItemTitle}</Link>
      <span dangerouslySetInnerHTML={{ __html: model.highlight ?? '' }} />
    </Flex>
  );
};

export const renderNoteSearchResult = (model: NoteSearchItem): ReactNode => {
  const clientUrl = getClientItemUrl(NOTE_RESOURCE_NAME, model.noteId);

  return (
    <Flex justify={'space-between'} gap={'small'}>
      <Link to={clientUrl}>{model.title}</Link>
      <span dangerouslySetInnerHTML={{ __html: model.highlight ?? '' }} />
    </Flex>
  );
};

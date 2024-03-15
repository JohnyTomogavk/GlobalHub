import React, { useEffect, useState } from 'react';
import { Header } from 'antd/es/layout/layout';
import { AutoComplete, Input, theme } from 'antd';
import UserToolBar from '../userToolBar/UserToolBar';
import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';
import { useDebounce, useEventTarget } from 'ahooks';
import useSearchApi from '../../../hooks/api/useSearchApi';
import { HttpStatusCode } from 'axios';
import { SearchResult } from '../../../models/fullTextSearch/searchResult';
import {
  renderBudgetItemSearchResult,
  renderBudgetSearchResult,
  renderNoteSearchResult,
  renderProjectItemSearchResult,
  renderProjectSearchResult,
} from '../../../helpers/searchResultHelper';
import { DefaultOptionType } from 'rc-select/lib/Select';

const AppHeader = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [value, { onChange }] = useEventTarget({ initialValue: '' });
  const [loading, setLoading] = useState(false);
  const debouncedSearchValue = useDebounce(value, { wait: 500 });
  const searchApi = useSearchApi();
  const [searchOptions, setSearchOptions] = useState<DefaultOptionType[]>([]);

  const updateOptions = (searchResults: SearchResult): void => {
    const options = [
      {
        label: 'Projects',
        options: searchResults.projectSearchItems.map((item) => ({
          label: renderProjectSearchResult(item),
        })),
      },
      {
        label: 'Project Items',
        options: searchResults.projectItemSearchItems.map((item) => ({
          label: renderProjectItemSearchResult(item),
        })),
      },
      {
        label: 'Budgets',
        options: searchResults.budgetSearchItems.map((item) => ({
          label: renderBudgetSearchResult(item),
        })),
      },
      {
        label: 'Budget Items',
        options: searchResults.budgetItemSearchItems.map((item) => ({
          label: renderBudgetItemSearchResult(item),
        })),
      },
      {
        label: 'Notes',
        options: searchResults.noteSearchItems.map((item) => ({
          label: renderNoteSearchResult(item),
        })),
      },
    ];

    setSearchOptions(options);
  };

  const fetchSearchResult = async (): Promise<void> => {
    setLoading(true);
    const { status, data } = await searchApi.search(debouncedSearchValue);

    if (status === HttpStatusCode.Ok) {
      updateOptions(data);
    } else {
      setSearchOptions([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSearchResult();
  }, [debouncedSearchValue]);

  return (
    <Header
      style={{
        background: colorBgContainer,
      }}
      className={styles.headerWrapper}
    >
      <AutoComplete variant={'borderless'} className={styles.autocomplete} options={searchOptions}>
        <Input.Search
          loading={loading}
          value={value}
          onChange={onChange}
          size="middle"
          allowClear
          placeholder={t('HEADER.SEARCH_PANEL.TYPE_HERE').toString()}
        />
      </AutoComplete>
      <UserToolBar />
    </Header>
  );
};

export default AppHeader;

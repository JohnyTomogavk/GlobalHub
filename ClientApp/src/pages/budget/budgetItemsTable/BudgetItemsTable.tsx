import { Button, Col, Collapse, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Typography } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { BudgetItemsFiltersModel } from '../../../models/budget/filterForm/budgetItemsFiltersModel';
import React, { ReactNode, useEffect, useState } from 'react';
import { BudgetItemsTableAggregationModel } from '../../../models/budgetItem/budgetItemsTableAggregationModel';
import { SorterResult } from 'antd/lib/table/interface';
import { BudgetItemTableEntry } from '../../../models/budgetItem/budgetItemsTableEntry';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { TagDto } from '../../../dto/tags/tagDto';
import { BudgetItemOperationType, BudgetItemOperationTypeTitle } from '../../../enums/budgetItemOperationType';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { isArray, toNumber } from 'lodash';
import { getBudgetItemsWithFiltersById } from '../../../api/budgetItemService';
import { BudgetItemsRequestDto } from '../../../dto/budgetItems/budgetItemsRequestDto';
import { BudgetItemsPaginatedResponseDto } from '../../../dto/budgetItems/budgetItemsPaginatedResponseDto';
import { BudgetItemDto } from '../../../dto/budgets/budgetItemDto';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface BudgetItemsPaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export const BudgetItemsTable = (props: { budgetId: number; budgetTags: TagDto[] }): JSX.Element => {
  const [budgetItemsTableEntries, setBudgetItemsTableEntries] = useState<BudgetItemTableEntry[] | undefined>();
  const [filtersForm] = useForm<BudgetItemsFiltersModel>();
  const [budgetItemTableAggregationModel, setBudgetItemTableAggregationModel] =
    useState<BudgetItemsTableAggregationModel>({
      totalIncoming: '0',
      totalExpenses: '0',
    });
  const [budgetItemsPaginationConfig, setBudgetItemsPaginationConfig] = useState<BudgetItemsPaginationConfig>({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0,
  });

  const initializeBudgetItemsTable = (budgetItemsDto: BudgetItemsPaginatedResponseDto): void => {
    const budgetItemEntries = budgetItemsDto.budgetItems.map(
      (item: BudgetItemDto): BudgetItemTableEntry => ({
        key: item.id,
        title: item.itemTitle,
        operationType: BudgetItemOperationTypeTitle[item.budgetItemOperationType],
        operationCost: item.budgetOperationCost.toFixed(1).toString(),
        tagIds: item.tagIds,
        paymentDate: new Date(item.paymentDate),
      })
    );

    setBudgetItemsTableEntries(budgetItemEntries);
    setBudgetItemTableAggregationModel({
      totalIncoming: budgetItemsDto.totalIncoming,
      totalExpenses: budgetItemsDto.totalExpenses,
    });
    setBudgetItemsPaginationConfig((prevState) => ({
      ...prevState,
      totalItems: budgetItemsDto.totalItems,
    }));
  };

  // eslint-disable-next-line no-magic-numbers
  const tablePageSizeOptions = [5, 10, 20, 50, 100];

  const columns: ColumnsType<BudgetItemTableEntry> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'ItemTitle',
      render: (text: string) => <a>{text}</a>,
      ellipsis: true,
      sorter: true,
    },
    {
      title: 'Operation type',
      dataIndex: 'operationType',
      key: 'BudgetItemOperationType',
      sorter: true,
    },
    {
      title: 'Operation Cost',
      dataIndex: 'operationCost',
      key: 'BudgetOperationCost',
      sorter: true,
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_: void, { tagIds }: { tagIds: number[] }) => (
        <>
          {tagIds.map((tagId: number) => {
            const tagDto = props.budgetTags.filter((dto: TagDto) => dto.id === tagId)[0];

            return (
              tagDto && (
                <Tag color={tagDto.color} key={tagDto.id}>
                  {tagDto.label}
                </Tag>
              )
            );
          })}
        </>
      ),
    },
    {
      title: 'Operation Date',
      dataIndex: 'paymentDate',
      key: 'PaymentDate',
      render: (data: Date) => data.toLocaleString(),
      sorter: true,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const getBudgetItemRequestDto = (
    currentPage?: number,
    countItemsPerPage?: number,
    sortColumn?: string,
    sortInAscendingOrder: boolean = true
  ): BudgetItemsRequestDto => {
    const filtersFormData = filtersForm.getFieldsValue();

    const filtersData = {
      title: filtersFormData.budgetItemTitle,
      tagIds: filtersFormData.budgetTagIds,
      startDateRange: filtersFormData.budgetItemDateRange && filtersFormData.budgetItemDateRange[0],
      endDateRange: filtersFormData.budgetItemDateRange && filtersFormData.budgetItemDateRange[1],
      budgetItemOperationType: filtersFormData.budgetItemOperationType,
    };

    const paginationData = {
      pageNumber: (currentPage ?? budgetItemsPaginationConfig.currentPage) - 1,
      itemsPerPageCount: countItemsPerPage ?? budgetItemsPaginationConfig.itemsPerPage,
    };

    const sortingData = {
      sortColumn: sortColumn,
      sortByAscending: sortInAscendingOrder,
    };

    return {
      ...paginationData,
      ...sortingData,
      filterModelDto: {
        ...filtersData,
      },
    };
  };

  const onTableChange = async (
    paginationConfig: TablePaginationConfig,
    sorterConfig: SorterResult<BudgetItemTableEntry> | SorterResult<BudgetItemTableEntry>[]
  ): Promise<void> => {
    sorterConfig = isArray(sorterConfig) ? sorterConfig[0] : sorterConfig;

    const requestDto = getBudgetItemRequestDto(
      paginationConfig.current,
      paginationConfig.pageSize,
      sorterConfig.column ? sorterConfig.columnKey?.toString() : undefined,
      sorterConfig.order === 'ascend'
    );

    const { data: budgetItemsResponse } = await getBudgetItemsWithFiltersById(toNumber(props.budgetId), requestDto);
    initializeBudgetItemsTable(budgetItemsResponse);
  };

  const onSearchButtonClick = async (): Promise<void> => {
    const requestDto = getBudgetItemRequestDto();
    const { data: budgetItemsResponse } = await getBudgetItemsWithFiltersById(toNumber(props.budgetId), requestDto);
    initializeBudgetItemsTable(budgetItemsResponse);
  };

  const resetFiltersForm = (): void => {
    filtersForm.resetFields();
  };

  const loadBudgetItems = async (): Promise<void> => {
    const requestDto = getBudgetItemRequestDto();

    const { data: budgetItemsResponse } = await getBudgetItemsWithFiltersById(toNumber(props.budgetId), requestDto);
    initializeBudgetItemsTable(budgetItemsResponse);
  };

  useEffect(() => {
    loadBudgetItems();
  }, [props.budgetId]);

  return (
    <>
      <Collapse
        size="small"
        items={[
          {
            label: 'Filters',
            forceRender: true,
            children: (
              <Form form={filtersForm} size={'small'} layout="horizontal" name={'BudgetItemsFilters'} title="Filters">
                <Row>
                  <Col span={8} offset={2}>
                    <Form.Item name={'budgetItemTitle'} label={'By title'}>
                      <Input placeholder="Input title" />
                    </Form.Item>
                    <Form.Item name={'budgetTagIds'} label={'By tags'}>
                      <Select
                        mode="multiple"
                        tagRender={(tagProps: CustomTagProps): JSX.Element => {
                          const { label, value: tagId, closable, onClose } = tagProps;

                          const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>): void => {
                            event.preventDefault();
                            event.stopPropagation();
                          };

                          const tagColor = props.budgetTags.filter((tag) => tag.id === tagId)[0].color;

                          return (
                            <Tag
                              color={tagColor}
                              closable={closable}
                              onClose={onClose}
                              onMouseDown={onPreventMouseDown}
                              style={{ marginRight: 3 }}
                            >
                              {label}
                            </Tag>
                          );
                        }}
                        placeholder={'Find tags'}
                        style={{ width: '100%' }}
                        options={[
                          ...(props.budgetTags.map((tagDto: TagDto) => ({
                            value: tagDto.id,
                            label: tagDto.label,
                          })) ?? []),
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} offset={4}>
                    <Form.Item name={'budgetItemDateRange'} label={'By date'}>
                      <RangePicker
                        style={{
                          width: '100%',
                        }}
                      />
                    </Form.Item>
                    <Form.Item name={'budgetItemOperationType'} label={'By operation type'}>
                      <Select
                        allowClear
                        placeholder={'Select operation type'}
                        options={[
                          { value: BudgetItemOperationType.Incoming, label: 'Incoming' },
                          { value: BudgetItemOperationType.Outgoing, label: 'Outgoing' },
                        ]}
                      />
                    </Form.Item>
                    <div style={{ textAlign: 'right' }}>
                      <Space size="small">
                        <Button onClick={onSearchButtonClick} type="primary" htmlType="submit">
                          Search
                        </Button>
                        <Button onClick={resetFiltersForm}>Clear</Button>
                      </Space>
                    </div>
                  </Col>
                </Row>
              </Form>
            ),
          },
        ]}
      />
      <Table
        sortDirections={['ascend', 'descend']}
        sticky
        onChange={(
          pagination,
          _,
          sorter: SorterResult<BudgetItemTableEntry> | SorterResult<BudgetItemTableEntry>[]
        ): Promise<void> => onTableChange(pagination, sorter)}
        scroll={{ y: '55vh' }}
        showSorterTooltip={false}
        summary={(): ReactNode => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <Text strong>Effective balance:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong>Total incoming: {budgetItemTableAggregationModel.totalIncoming} BYN</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text strong>Total expenses: {budgetItemTableAggregationModel.totalExpenses} BYN</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
        size={'small'}
        columns={columns}
        pagination={{
          size: 'small',
          total: budgetItemsPaginationConfig.totalItems,
          pageSizeOptions: tablePageSizeOptions,
          showSizeChanger: true,
          defaultPageSize: budgetItemsPaginationConfig?.itemsPerPage,
          onChange: (pageNumber: number, pageSize: number): void => {
            setBudgetItemsPaginationConfig((config) => ({
              ...config,
              itemsPerPage: pageSize,
              currentPage: pageNumber,
            }));
          },
        }}
        dataSource={budgetItemsTableEntries}
      />
    </>
  );
};

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Badge, Col, DatePicker, Dropdown, Flex, Form, Input, Popover, Row, Space } from 'antd';
import styles from './fitlersHeader.module.scss';
import { CloseOutlined, DeleteOutlined, FilterOutlined, GroupOutlined } from '@ant-design/icons';
import Button from 'antd/es/button';
import { Checkbox } from 'antd';
import { debounce, toNumber } from 'lodash';
import { SEARCH_FILTER_DEBOUNCE } from '../../../constants/projectsConstants';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { ProjectItemFiltersModel } from '../../../models/projects/projectItemFiltersModel';
import { nameof } from '../../../helpers/objectHelper';
import { getEnumValuesExcluding } from '../../../helpers/enumHelper';
import { ProjectItemTypeLabels, ProjectItemType } from '../../../enums/Projects/projectItemType';
import {
  ProjectItemPriority,
  ProjectItemPriorityIcons,
  ProjectItemPriorityTitles,
} from '../../../enums/Projects/projectItemPriority';
import { TaskStatus, TaskStatusBadgeTypes, TaskStatusTitles } from '../../../enums/Projects/taskStatus';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { GroupingMode, GroupingModeIcons, GroupingModeLabels } from '../../../enums/Projects/groupingMode';
import { TagDto } from '../../../dto/budgetTags/tagDto';

const { RangePicker } = DatePicker;

interface FiltersHeaderProps {
  tags: TagDto[];
  onFiltersUpdate: (filterModel: ProjectItemFiltersModel) => void;
  onGroupingUpdate: (groupingMode: GroupingMode) => void;
  selectionInfo?: string;
  onSelectionDelete: () => void;
  onSelectionCancel: () => void;
}

export const FiltersHeader = ({
  tags,
  onFiltersUpdate,
  onGroupingUpdate,
  selectionInfo,
  onSelectionDelete,
  onSelectionCancel,
}: FiltersHeaderProps): JSX.Element => {
  const [searchItemsInputValue, setSearchItemsInputValue] = useState<string>('');
  const [filtersForm] = useForm<ProjectItemFiltersModel>();
  const formWatch = useWatch([], filtersForm);

  const getFilterValues = (titleFilter?: string): ProjectItemFiltersModel => ({
    ...filtersForm.getFieldsValue(),
    searchTitle: titleFilter ?? searchItemsInputValue,
  });

  useEffect(() => {
    const filters = getFilterValues();
    onFiltersUpdate(filters);
  }, [formWatch]);

  const onSearchFilterUpdateDebounced = useCallback(
    debounce((searchValue: string): void => {
      const filters = getFilterValues(searchValue);
      onFiltersUpdate(filters);
    }, SEARCH_FILTER_DEBOUNCE),
    []
  );

  const onGroupingModeSelect = (selectedKey: string): void => {
    const newGroupingMode = toNumber(selectedKey) as GroupingMode;
    onGroupingUpdate(newGroupingMode);
  };

  const onSearchFilterUpdate = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const searchValue = e.target.value;
    setSearchItemsInputValue(searchValue);
    onSearchFilterUpdateDebounced(searchValue);
  };

  const onFiltersClear = (): void => {
    filtersForm.resetFields();
  };

  return (
    <Row className={styles.headerBlock}>
      <Col span={6}>
        <Input value={searchItemsInputValue} onChange={onSearchFilterUpdate} allowClear placeholder={'Search items'} />
      </Col>
      <Col span={6} offset={1} className={styles.controlGroup}>
        {selectionInfo ? (
          <Button.Group size={'small'}>
            <Button icon={<CloseOutlined />} onClick={onSelectionCancel}>
              {selectionInfo}
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={onSelectionDelete} />
          </Button.Group>
        ) : (
          <></>
        )}
      </Col>
      <Col offset={7}>
        <Popover
          autoAdjustOverflow={true}
          arrow={false}
          overlayStyle={{ width: 400 }}
          title={
            <Flex justify={'space-between'}>
              <span>Filter by</span>
              <Button type={'text'} onClick={onFiltersClear}>
                Clear
              </Button>
            </Flex>
          }
          trigger={['click']}
          content={
            <Form form={filtersForm} title={'Filters'} size={'small'} layout={'vertical'}>
              <Form.Item label={'Date range'} name={nameof<ProjectItemFiltersModel>('dateRange')}>
                <RangePicker allowEmpty={[true, true]} placeholder={['Start date', 'Due date']} />
              </Form.Item>
              <Form.Item label={'Item types'} name={nameof<ProjectItemFiltersModel>('itemTypes')}>
                <Checkbox.Group
                  options={getEnumValuesExcluding(ProjectItemType, [ProjectItemType.Unknown]).map((enumValue) => ({
                    label: ProjectItemTypeLabels[enumValue as keyof typeof ProjectItemTypeLabels],
                    value: enumValue,
                  }))}
                />
              </Form.Item>
              <Form.Item label={'Tags'} name={nameof<ProjectItemFiltersModel>('tagIds')}>
                <Checkbox.Group options={tags.map((tag) => ({ label: tag.label, value: tag.id }))} />
              </Form.Item>
              <Form.Item label={'Priorities'} name={nameof<ProjectItemFiltersModel>('priorities')}>
                <Checkbox.Group
                  options={getEnumValuesExcluding(ProjectItemPriority, [ProjectItemPriority.Unknown]).map(
                    (priority) => ({
                      label: (
                        <Space size={'small'}>
                          {ProjectItemPriorityIcons[priority as keyof typeof ProjectItemPriorityIcons]}
                          <span>{ProjectItemPriorityTitles[priority as keyof typeof ProjectItemPriorityTitles]}</span>
                        </Space>
                      ),
                      value: priority,
                    })
                  )}
                />
              </Form.Item>
              <Form.Item label={'Statuses'} name={nameof<ProjectItemFiltersModel>('statuses')}>
                <Checkbox.Group
                  options={getEnumValuesExcluding(TaskStatus, [TaskStatus.Unknown]).map((status) => ({
                    label: (
                      <Badge
                        status={
                          TaskStatusBadgeTypes[status as keyof typeof TaskStatusBadgeTypes] as PresetStatusColorType
                        }
                        text={TaskStatusTitles[status as keyof typeof TaskStatusTitles]}
                      />
                    ),
                    value: status,
                  }))}
                />
              </Form.Item>
            </Form>
          }
        >
          <Button type={'text'} icon={<FilterOutlined />}>
            Filter
          </Button>
        </Popover>
        <Dropdown
          trigger={['click']}
          placement={'bottomRight'}
          menu={{
            items: getEnumValuesExcluding(GroupingMode, [GroupingMode.Unknown]).map((modeValue) => ({
              label: GroupingModeLabels[modeValue as keyof typeof GroupingModeLabels],
              key: modeValue,
              icon: GroupingModeIcons[modeValue as keyof typeof GroupingModeLabels],
            })),
            selectable: true,
            onSelect: ({ key }) => onGroupingModeSelect(key),
            defaultSelectedKeys: [GroupingMode.None.toString()],
          }}
        >
          <Button type={'text'} icon={<GroupOutlined />}>
            Group
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
};

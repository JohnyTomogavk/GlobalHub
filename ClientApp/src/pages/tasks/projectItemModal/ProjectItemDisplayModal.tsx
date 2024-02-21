import React, { ReactNode, useEffect, useState } from 'react';
import { Badge, Card, Col, DatePicker, Input, Modal, Progress, Row, Select, Space, Table, Typography } from 'antd';
import { ProjectItemDto } from '../../../dto/projects/projectItems/projectItemDto';
import { TagDto } from '../../../dto/budgetTags/tagDto';
import styles from './projectItemDisplayModal.module.scss';
import { ProjectItemType, ProjectItemTypeIcons, ProjectItemTypeLabels } from '../../../enums/Projects/projectItemType';
import {
  ProjectItemPriority,
  ProjectItemPriorityIcons,
  ProjectItemPriorityTitles,
} from '../../../enums/Projects/projectItemPriority';
import { getEnumValueByKey, getEnumValues, getEnumValuesExcluding } from '../../../helpers/enumHelper';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { TaskStatus, TaskStatusBadgeTypes, TaskStatusTitles } from '../../../enums/Projects/taskStatus';
import Title from 'antd/es/typography/Title';
import styled from 'styled-components';
import { TagSelector } from '../../../components/tagSelector/TagSelector';
import dayjs from 'dayjs';
import { mapProjectItemDtoToDisplayModalModel } from '../../../helpers/projectItemHelper';
import { ColumnsType } from 'antd/lib/table';
import { nameof } from '../../../helpers/objectHelper';
import { IHasDate } from '../../../interfaces/IHasDate';
import { IHasAuthor } from '../../../interfaces/IHasAuthor';

const { TextArea } = Input;
const { Text } = Typography;
const CONVERT_TO_PERCENT_RATIO = 100;

interface IProjectItemModalProps {
  isOpened: boolean;
  onClose: () => void;
  projectItemToDisplay: ProjectItemDto;
  projectItems: ProjectItemDto[];
  tags: TagDto[];
}

const AppSelect = styled(Select)`
  div.ant-select-selector:has(#appSelect) {
    padding: 0;
  }
`;

export interface ProjectItemDisplayModel extends IHasDate, IHasAuthor {
  id: number;
  title: string;
  description: string;
  itemType: ProjectItemType;
  itemPriority: ProjectItemPriority;
  taskStatus?: TaskStatus;
  startDate?: dayjs.Dayjs;
  dueDate?: dayjs.Dayjs;
  parentProjectItemId?: number;
  parentProjectItem?: ProjectItemDto;
  projectId: number;
  tagIds: number[];
}

interface ProjectItemShortModel {
  key: number;
  title: string;
  status: TaskStatus;
  priority: ProjectItemPriority;
}

const columns: ColumnsType<ProjectItemShortModel> = [
  {
    dataIndex: nameof<ProjectItemShortModel>('title'),
    width: '60%',
    render: (value) => <Text>{value}</Text>,
  },
  {
    dataIndex: nameof<ProjectItemShortModel>('priority'),
    width: '10%',
    render: (value: ProjectItemPriority): JSX.Element => <>{ProjectItemPriorityIcons[value]}</>,
  },
  {
    dataIndex: nameof<ProjectItemShortModel>('status'),
    width: '25%',
    render: (value: TaskStatus): JSX.Element => (
      <Badge status={TaskStatusBadgeTypes[value] as PresetStatusColorType} text={TaskStatusTitles[value]} />
    ),
  },
];

export const ProjectItemDisplayModal = ({ projectItemToDisplay, ...props }: IProjectItemModalProps): JSX.Element => {
  const [projectItemModel, setProjectItemModelModel] = useState<ProjectItemDisplayModel>(
    mapProjectItemDtoToDisplayModalModel(projectItemToDisplay)
  );

  useEffect(() => {
    const projectItemDisplayModel = mapProjectItemDtoToDisplayModalModel(projectItemToDisplay);
    setProjectItemModelModel(projectItemDisplayModel);
  }, [projectItemToDisplay]);

  const getTitle = (): ReactNode => {
    const typeValue = getEnumValueByKey(ProjectItemType, projectItemModel.itemType);
    const icon = ProjectItemTypeIcons[typeValue];
    const typeLabel = ProjectItemTypeLabels[typeValue];

    return (
      <Space className={styles.modalTitle}>
        {icon}
        {typeLabel}
      </Space>
    );
  };

  const getProjectTypeTitle = (): ReactNode => {
    const typeValue = getEnumValueByKey(ProjectItemType, projectItemModel.itemType);
    const icon = ProjectItemTypeIcons[typeValue];
    const typeLabel = ProjectItemTypeLabels[typeValue];

    return (
      <Space className={styles.modalTitle}>
        {icon}
        {typeLabel}
      </Space>
    );
  };

  const onProjectTitleUpdate = (value: string): void => {
    // TODO: Update API to update title

    setProjectItemModelModel((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  const onSelectedTagsUpdate = (values: number[]): void => {
    // TODO: Call API to update tags

    setProjectItemModelModel((prevState) => ({
      ...prevState,
      tagIds: values,
    }));
  };

  const getChildItemsInfoBlock = (): ReactNode => {
    const childItems: ProjectItemShortModel[] = props.projectItems
      .filter((t) => t.parentProjectItemId === projectItemModel.id)
      .map((item) => ({
        key: item.id,
        title: item.title,
        priority: getEnumValueByKey(ProjectItemPriority, item.itemPriority),
        status: getEnumValueByKey(TaskStatus, item.taskStatus ?? TaskStatus.Unknown),
      }));

    if (childItems.length === 0) return <></>;

    const itemsCount = childItems.length;
    const itemsDonePercent = Math.floor(
      (childItems.filter((t) => t.status === TaskStatus.Done).length * CONVERT_TO_PERCENT_RATIO) / itemsCount
    );
    const itemsInProgressPercent = Math.floor(
      (childItems.filter((t) => t.status === TaskStatus.InProgress).length * CONVERT_TO_PERCENT_RATIO) / itemsCount
    );

    return (
      <div className={styles.infoBlock}>
        <Row>
          <Col>
            <Text strong>Child items</Text>
          </Col>
        </Row>
        <Row justify={'space-between'}>
          <Col span={20}>
            <Progress
              status={'active'}
              format={() => <></>}
              success={{ percent: itemsDonePercent }}
              percent={itemsDonePercent + itemsInProgressPercent}
            />
          </Col>
          <Col>{`${itemsDonePercent}% done`}</Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              scroll={{ y: '15vh' }}
              bordered={true}
              size={'small'}
              showHeader={false}
              pagination={false}
              columns={columns}
              dataSource={childItems}
            />
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Modal open={props.isOpened} title={getTitle()} footer={false} width={1000} onCancel={props.onClose}>
      <Row>
        <Col span={14}>
          <Title
            editable={{
              triggerType: ['text'],
              onChange: onProjectTitleUpdate,
            }}
            level={5}
            style={{ marginTop: 0 }}
          >
            {projectItemModel.title}
          </Title>
          {getChildItemsInfoBlock()}
          <Row>
            <Col>
              <Text strong>Description</Text>
            </Col>
          </Row>
          <Row>
            <TextArea placeholder={'Description'} />
          </Row>
        </Col>
        <Col span={9} offset={1}>
          <Card title={'Details'} size={'small'} className={styles.detailsCard}>
            <Row className={styles.detailsRow}>
              <Col>
                <Text strong>Item Type</Text>
              </Col>
              <Col span={14}>{getProjectTypeTitle()}</Col>
            </Row>
            <Row className={styles.detailsRow}>
              <Col>
                <Text strong>Priority</Text>
              </Col>
              <Col span={14}>
                <AppSelect
                  id={'appSelect'}
                  placeholder={'Priority'}
                  value={getEnumValueByKey(ProjectItemPriority, projectItemModel.itemPriority).toString()}
                  bordered={false}
                  rootClassName={styles.selectControl}
                  suffixIcon={null}
                >
                  {getEnumValuesExcluding(ProjectItemPriority, [ProjectItemPriority.Unknown]).map((itemPriority) => (
                    <Select.Option key={itemPriority}>
                      <Space>
                        {ProjectItemPriorityIcons[itemPriority as keyof typeof ProjectItemPriorityIcons]}
                        {ProjectItemPriorityTitles[itemPriority as keyof typeof ProjectItemPriorityTitles]}
                      </Space>
                    </Select.Option>
                  ))}
                </AppSelect>
              </Col>
            </Row>
            {((): JSX.Element => {
              if (getEnumValueByKey(ProjectItemType, projectItemModel.itemType) === ProjectItemType.Event) return <></>;

              return (
                <Row className={styles.detailsRow}>
                  <Col>
                    <Text strong>Task Status</Text>
                  </Col>
                  <Col span={14}>
                    <AppSelect
                      id={'appSelect'}
                      className={styles.selectControl}
                      placeholder={'Status'}
                      value={getEnumValueByKey(
                        TaskStatus,
                        projectItemModel.taskStatus ?? TaskStatus.Unknown
                      ).toString()}
                      bordered={false}
                      suffixIcon={null}
                    >
                      {getEnumValues(TaskStatus).map((taskStatus) => (
                        <Select.Option key={taskStatus}>
                          <Badge
                            status={
                              TaskStatusBadgeTypes[
                                taskStatus as keyof typeof TaskStatusBadgeTypes
                              ] as PresetStatusColorType
                            }
                            text={TaskStatusTitles[taskStatus as keyof typeof TaskStatusTitles]}
                          />
                        </Select.Option>
                      ))}
                    </AppSelect>
                  </Col>
                </Row>
              );
            })()}
            <Row className={styles.detailsRow}>
              <Col>
                <Text strong>Tags</Text>
              </Col>
              <Col span={14}>
                <TagSelector
                  isControlledField={true}
                  bordered={false}
                  onChange={onSelectedTagsUpdate}
                  selectedTagIds={projectItemModel.tagIds}
                  tags={props.tags}
                />
              </Col>
            </Row>
            <Row className={styles.detailsRow}>
              <Col>
                <Text strong>Start date</Text>
              </Col>
              <Col span={14}>
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                  bordered={false}
                  suffixIcon={null}
                  size={'small'}
                  value={projectItemModel.startDate}
                  placeholder={'Start date'}
                />
              </Col>
            </Row>
            <Row className={styles.detailsRow}>
              <Col>
                <Text strong>Due date</Text>
              </Col>
              <Col span={14}>
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD HH:mm"
                  bordered={false}
                  size={'small'}
                  suffixIcon={null}
                  value={projectItemModel.dueDate}
                  placeholder={'Due date'}
                />
              </Col>
            </Row>
          </Card>
          <Row justify={'space-between'}>
            <Col>
              <Text strong>Created at</Text>
            </Col>
            <Col span={14}>{projectItemModel.createdDate.toLocaleString()}</Col>
          </Row>
          <Row justify={'space-between'}>
            <Col>
              <Text strong>Updated at</Text>
            </Col>
            <Col span={14}>{projectItemModel?.updatedDate?.toLocaleString()}</Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

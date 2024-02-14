import React, { useEffect, useState } from 'react';
import { Badge, Button, DatePicker, Drawer, Form, Input, Select, Space, TreeSelect } from 'antd';
import styles from '../../pages/tasks/projectItemDrawer/projectItemDrawer.module.scss';
import { useForm } from 'antd/lib/form/Form';
import { Loader } from '../../components/loader/Loader';
import { nameof } from '../../helpers/objectHelper';
import { getEnumValuesExcluding } from '../../helpers/enumHelper';
import { ProjectItemType, ProjectItemTypeIcons, ProjectItemTypeLabels } from '../../enums/Projects/projectItemType';
import { ProjectItemFormModel } from '../../pages/tasks/projectItemDrawer/projectItemFormModel';
import {
  ProjectItemPriority,
  ProjectItemPriorityIcons,
  ProjectItemPriorityTitles,
} from '../../enums/Projects/projectItemPriority';
import { TaskStatus, TaskStatusBadgeTypes, TaskStatusTitles } from '../../enums/Projects/taskStatus';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import { toNumber } from 'lodash';
import { tagSelectorValidator } from '../../validators/tagSelectorValidators';
import { TagSelector } from '../../components/tagSelector/TagSelector';
import { ProjectItemDto } from '../../dto/projects/projectItems/projectItemDto';
import { fillChildItems } from '../../helpers/projectItemHelper';
import { TagColor } from '../../enums/shared/tagColor';
import useProjectTagsApi from '../../hooks/api/useProjectTagsApi';
import { HttpStatusCode } from 'axios';
import useNewTagFormWatcher from '../../hooks/api/useNewTagFormWatcher';
import { TagDto } from '../../dto/budgetTags/tagDto';

const { TextArea } = Input;

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ProjectItemDrawerProps {
  projectId: number;
  isDrawerOpened: boolean;
  onClose: () => void;
  initialFormData?: ProjectItemFormModel;
  projectTags: TagDto[];
  onFormSubmit: (formData: ProjectItemFormModel) => void;
  onTagEdit: (tagData: TagDto) => Promise<void>;
  onTagDelete: (tagId: number) => Promise<void>;
  onTagCreated: (tag: TagDto) => Promise<void>;
  projectItems: ProjectItemDto[];
}

interface TreeSelectEntry {
  id: number;
  title: string;
  value: number;
  parentProjectItemId?: number;
  children?: TreeSelectEntry[];
}

const getProjectItemTreeSelectData = (projectItemDtos: ProjectItemDto[]): TreeSelectEntry[] => {
  const projectTasks = projectItemDtos
    .filter((item) => {
      const enumValue = toNumber(ProjectItemType[item.itemType]);

      return enumValue !== ProjectItemType.Event;
    })
    .map(
      (item) =>
        ({
          id: item.id,
          title: item.title,
          value: item.id,
          parentProjectItemId: item.parentProjectItemId,
        }) as TreeSelectEntry
    );
  const topLevelItems = projectTasks.filter((model) => !model.parentProjectItemId);
  topLevelItems.forEach((model) => fillChildItems(model, projectTasks));

  return topLevelItems;
};

export const ProjectItemDrawer = ({
  projectId,
  isDrawerOpened,
  initialFormData,
  onClose,
  onFormSubmit,
  projectTags,
  onTagCreated,
  onTagEdit,
  onTagDelete,
  projectItems,
}: ProjectItemDrawerProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const [projectItemFormInstance] = useForm<ProjectItemFormModel>();
  const [projectItemsTreeData, setProjectItemsTreeData] = useState<TreeSelectEntry[] | undefined>(undefined);

  const projectTagsApi = useProjectTagsApi();

  const createNewTag = async (tagLabel: string): Promise<TagDto> => {
    const { data: createdTag } = await projectTagsApi.createTag({
      projectId: projectId,
      label: tagLabel,
      color: TagColor.Default,
    });

    await onTagCreated(createdTag);

    return createdTag;
  };

  useNewTagFormWatcher(projectItemFormInstance, nameof<ProjectItemFormModel>('tagIds'), createNewTag);

  useEffect(() => {
    setIsLoading(false);

    return () => {
      setIsLoading(true);
      projectItemFormInstance.resetFields();
    };
  }, []);

  useEffect(() => {
    const items = getProjectItemTreeSelectData(projectItems);
    setProjectItemsTreeData(items);
  }, [projectItems]);

  const isFormValid = async (): Promise<boolean> => {
    try {
      await projectItemFormInstance.validateFields();

      return true;
    } catch {
      return false;
    }
  };

  const onFormSubmitClick = async (): Promise<void> => {
    const isValid = await isFormValid();

    if (!isValid) return;

    const budgetItemModel = projectItemFormInstance.getFieldsValue();

    onFormSubmit(budgetItemModel);
    onClose();
  };

  const onTagUpdated = async (updatedTag: TagDto): Promise<void> => {
    const { status } = await projectTagsApi.updateTag({
      ...updatedTag,
      projectId: projectId,
    });

    if (status === HttpStatusCode.Ok) {
      await onTagEdit(updatedTag);
    }
  };

  const onTagDeleted = async (tagIdToDelete: number): Promise<void> => {
    const { status } = await projectTagsApi.deleteTag(tagIdToDelete);

    if (status === HttpStatusCode.Ok) {
      const selectedTags = projectItemFormInstance.getFieldsValue().tagIds;
      const newSelectedTagsValues = selectedTags.filter((tagId: number) => tagId !== tagId);
      projectItemFormInstance.setFieldValue(nameof<ProjectItemFormModel>('tagIds'), newSelectedTagsValues);

      await onTagDelete(tagIdToDelete);
    }
  };

  return (
    <Drawer
      open={isDrawerOpened}
      onClose={onClose}
      title={'Project item'}
      extra={
        <Button size={'small'} onClick={onFormSubmitClick} type="primary">
          Submit
        </Button>
      }
    >
      {((): JSX.Element => {
        if (isLoading) {
          return (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          );
        }

        return (
          <Form
            form={projectItemFormInstance}
            initialValues={initialFormData}
            title={initialFormData?.title ?? 'Project item'}
            size={'small'}
            layout={'vertical'}
            labelAlign={'left'}
          >
            <Form.Item
              rules={[{ required: true, message: 'Title is required' }]}
              name={nameof<ProjectItemFormModel>('title')}
              label={'Title'}
            >
              <Input placeholder={'Title'} />
            </Form.Item>
            <Form.Item
              name={nameof<ProjectItemFormModel>('itemType')}
              label={'Item type'}
              rules={[{ required: true, message: 'Item type is required' }]}
            >
              <Select placeholder={'Item type'}>
                {getEnumValuesExcluding(ProjectItemType, [ProjectItemType.Unknown]).map((itemTypeValue) => (
                  <Option key={itemTypeValue}>
                    <Space>
                      {ProjectItemTypeIcons[itemTypeValue as keyof typeof ProjectItemTypeIcons]}
                      {ProjectItemTypeLabels[itemTypeValue as keyof typeof ProjectItemTypeLabels]}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.itemType !== currentValues.itemType}
            >
              {({ getFieldValue }) => {
                const isEvent =
                  toNumber(getFieldValue(nameof<ProjectItemFormModel>('itemType'))) === ProjectItemType.Event;

                return (
                  <Form.Item
                    name={nameof<ProjectItemFormModel>('dateRange')}
                    label={'Date range'}
                    rules={[
                      isEvent ? { required: true, message: 'Date range is required for events' } : { required: false },
                    ]}
                  >
                    <RangePicker
                      showSecond
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: '100%' }}
                      placeholder={['Start date', 'Due date']}
                      allowEmpty={[true, true]}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
            <Form.Item
              rules={[
                {
                  message: 'You have not selected any tags',
                  warningOnly: true,
                  validator: (_, values) => tagSelectorValidator(values),
                },
              ]}
              name={nameof<ProjectItemFormModel>('tagIds')}
              tooltip={'Tags help you to recognize your tasks and events'}
              label={'Tags'}
            >
              <TagSelector
                onTagUpdated={onTagUpdated}
                onTagDelete={onTagDeleted}
                isTagCreatorEnabled={true}
                tags={projectTags}
              />
            </Form.Item>
            <Form.Item
              name={nameof<ProjectItemFormModel>('itemPriority')}
              label={'Item priority'}
              rules={[{ required: true, message: 'Item priority is required' }]}
            >
              <Select placeholder={'Item priority'}>
                {getEnumValuesExcluding(ProjectItemPriority, [ProjectItemPriority.Unknown]).map((itemPriority) => (
                  <Option key={itemPriority as number}>
                    <Space>
                      {ProjectItemPriorityIcons[itemPriority as keyof typeof ProjectItemPriorityIcons]}
                      {ProjectItemPriorityTitles[itemPriority as keyof typeof ProjectItemPriorityTitles]}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.itemType !== currentValues.itemType}
            >
              {({ getFieldValue }) =>
                toNumber(getFieldValue(nameof<ProjectItemFormModel>('itemType'))) === ProjectItemType.Task ? (
                  <>
                    <Form.Item
                      name={nameof<ProjectItemFormModel>('taskStatus')}
                      label={'Task status'}
                      rules={[{ required: true, message: 'Status is required' }]}
                    >
                      <Select placeholder={'Status'}>
                        {getEnumValuesExcluding(TaskStatus, [TaskStatus.Unknown]).map((statusValue) => (
                          <Option key={statusValue as number}>
                            <Badge
                              status={
                                TaskStatusBadgeTypes[
                                  statusValue as keyof typeof TaskStatusBadgeTypes
                                ] as PresetStatusColorType
                              }
                              text={TaskStatusTitles[statusValue as keyof typeof TaskStatusTitles]}
                            />
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name={nameof<ProjectItemFormModel>('parentProjectItemId')} label={'Parent task'}>
                      <TreeSelect treeData={projectItemsTreeData} allowClear placeholder={'Parent task'} />
                    </Form.Item>
                  </>
                ) : null
              }
            </Form.Item>
            <Form.Item name={nameof<ProjectItemFormModel>('description')} label={'Description'}>
              <TextArea rows={3} placeholder={'Description'} />
            </Form.Item>
          </Form>
        );
      })()}
    </Drawer>
  );
};

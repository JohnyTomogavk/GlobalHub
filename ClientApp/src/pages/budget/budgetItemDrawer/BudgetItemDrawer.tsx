import { Button, DatePicker, Drawer, Form, Input, Select, Spin, Typography } from 'antd';
import { InputNumber } from 'antd/lib';
import { BudgetItemOperationType } from '../../../enums/budgetItemOperationType';
import { TagSelector } from '../../../components/tagSelector/TagSelector';
import TextArea from 'antd/lib/input/TextArea';
import React, { useEffect, useState } from 'react';
import { TagDto } from '../../../dto/tags/tagDto';
import { BudgetItemDrawerModel } from '../../../models/budgetItem/budgetItemDrawer/budgetItemDrawerModel';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../../../styles.module.scss';
import { tagSelectorValidator } from '../../../validators/tagSelectorValidators';
import dayjs from 'dayjs';
import { createBudgetTag, deleteTag, updateBudgetTag } from '../../../api/tagService';
import { TagColor } from '../../../enums/tagColor';
import { nameof } from '../../../helpers/objectHelper';

const { Text } = Typography;

interface BudgetItemDrawerProps {
  title: string;
  onFormCloseCallback: () => void;
  isDrawerOpened: boolean;
  budgetItemTags: TagDto[];
  onNewTagAdded: (newTag: TagDto) => void;
  isDisabled?: boolean;
  onSubmitCallback?: (budgetItemModel: BudgetItemDrawerModel) => void;
  initFormValues?: BudgetItemDrawerModel;
  budgetId: number;
  setBudgetTags: (value: ((prevState: TagDto[]) => TagDto[]) | TagDto[]) => void;
  onTagRemoved: (removedTagId: number) => void;
}

export const BudgetItemDrawer = ({
  title,
  onFormCloseCallback,
  isDrawerOpened,
  budgetItemTags,
  onNewTagAdded,
  onSubmitCallback,
  isDisabled,
  initFormValues,
  budgetId,
  setBudgetTags,
  onTagRemoved,
}: BudgetItemDrawerProps): JSX.Element => {
  const [budgetItemForm] = useForm<BudgetItemDrawerModel>();
  const [isLoading, setIsLoading] = useState(true);
  const selectedTagsWatcher = useWatch('selectedTags', budgetItemForm);

  const todayDate = dayjs(new Date());

  const isFormValid = async (): Promise<boolean> => {
    try {
      await budgetItemForm.validateFields();

      return true;
    } catch {
      return false;
    }
  };

  const submitForm = async (): Promise<void> => {
    const isValid = await isFormValid();

    if (!isValid) return;

    const budgetItemModel = {
      ...initFormValues,
      ...budgetItemForm.getFieldsValue(),
    };

    if (onSubmitCallback) {
      onSubmitCallback(budgetItemModel);
    }

    onFormCloseCallback();
  };

  const onFormClose = (): void => {
    onFormCloseCallback();
    budgetItemForm.resetFields();
  };

  const onAfterOpenChange = (open: boolean): void => {
    if (!open) {
      setIsLoading(true);

      return;
    }

    if (initFormValues) {
      budgetItemForm.setFieldsValue(initFormValues);
    } else {
      budgetItemForm.resetFields();
    }

    setIsLoading(false);
  };

  const createNewTag = async (tagLabel: string): Promise<TagDto> => {
    const { data: createdTag } = await createBudgetTag({
      budgetId: budgetId,
      label: tagLabel,
      color: TagColor.Default,
    });

    onNewTagAdded(createdTag);

    return createdTag;
  };

  const handleJustCreatedTag = async (selectedTags: (number | string)[]): Promise<void> => {
    const newTagLabel = selectedTags.filter((tag) => typeof tag === 'string')[0] as string;

    if (!newTagLabel) return;

    const createdTag = await createNewTag(newTagLabel);

    const selectedTagIds = selectedTags.map((tag) => {
      if (typeof tag === 'string' && tag === createdTag.label) {
        return createdTag.id;
      }

      return tag;
    });

    budgetItemForm.setFieldValue(nameof<BudgetItemDrawerModel>('selectedTags'), selectedTagIds);
  };

  useEffect(() => {
    const selectedTags = budgetItemForm.getFieldsValue().selectedTags ?? [];

    handleJustCreatedTag(selectedTags);
  }, [selectedTagsWatcher]);

  const onTagEdit = async (tagData: TagDto): Promise<void> => {
    const { data: updatedTag } = await updateBudgetTag(tagData);
    setBudgetTags((prevState) => prevState.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)));
  };

  const onTagDelete = async (tagId: number): Promise<void> => {
    const { data: removedTagId } = await deleteTag(tagId);
    setBudgetTags((prevState) => prevState.filter((tag) => tag.id !== removedTagId));
    const selectedTags = budgetItemForm.getFieldsValue().selectedTags ?? [];
    const newSelectedTagsValues = selectedTags.filter((tag) => typeof tag === 'number' && tag !== removedTagId);

    budgetItemForm.setFieldValue(nameof<BudgetItemDrawerModel>('selectedTags'), newSelectedTagsValues);
    onTagRemoved(removedTagId);
  };

  return (
    <Drawer
      title={title}
      onClose={onFormClose}
      afterOpenChange={onAfterOpenChange}
      open={isDrawerOpened}
      extra={
        !isDisabled ? (
          <Button size={'small'} onClick={submitForm} type="primary">
            Submit
          </Button>
        ) : (
          <></>
        )
      }
    >
      {isLoading ? (
        <Spin className={styles.loader} indicator={<LoadingOutlined />} />
      ) : (
        <Form
          form={budgetItemForm}
          initialValues={initFormValues}
          size={'small'}
          disabled={isDisabled}
          layout="vertical"
          name={'BudgetItemForm'}
        >
          <Form.Item rules={[{ required: true, message: 'Budget Item title required' }]} name={'title'} label={'Title'}>
            <Input placeholder={'Title'} />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Operation Date is required' }]}
            initialValue={todayDate}
            name={'operationDate'}
            label={'Operation Date'}
          >
            <DatePicker
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Operation Cost is required' }]}
            name={'operationCost'}
            label={'Operation Cost'}
          >
            <InputNumber
              addonBefore={<Text>BYN</Text>}
              size={'small'}
              step={10}
              min={0}
              style={{
                width: '100%',
              }}
              disabled={isDisabled}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Operation type is required' }]}
            name={'operationType'}
            label={'Operation Type'}
          >
            <Select
              allowClear
              placeholder={'Select operation type'}
              options={[
                { value: BudgetItemOperationType.Incoming, label: 'Incoming' },
                { value: BudgetItemOperationType.Outgoing, label: 'Outgoing' },
              ]}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                message: 'You have not selected any tags',
                warningOnly: true,
                validator: (_, values) => tagSelectorValidator(values),
              },
            ]}
            name={'selectedTags'}
            tooltip={'Tags help to classify your expenses and perform analytic on them'}
            label={'Tags'}
          >
            <TagSelector
              onTagUpdated={onTagEdit}
              onTagDelete={onTagDelete}
              isTagCreatorEnabled={!isDisabled}
              tags={budgetItemTags ?? []}
            />
          </Form.Item>
          <Form.Item name={'description'} label={'Description'}>
            <TextArea rows={3} disabled={isDisabled} placeholder={'Description'} />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

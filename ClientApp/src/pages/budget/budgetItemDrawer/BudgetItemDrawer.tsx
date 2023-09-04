import { Button, DatePicker, Drawer, Form, Input, Select, Space, Spin, Typography } from 'antd';
import { InputNumber } from 'antd/lib';
import { BudgetItemOperationType } from '../../../enums/budgetItemOperationType';
import { NewTagData, TagSelector } from '../../../components/tagSelector/TagSelector';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import { TagDto } from '../../../dto/tags/tagDto';
import { BudgetItemDrawerModel } from '../../../models/budgetItem/budgetItemDrawer/budgetItemDrawerModel';
import { useForm } from 'antd/lib/form/Form';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../../../styles.module.scss';
import { tagSelectorValidator } from '../../../validators/tagSelectorValidators';
import dayjs from 'dayjs';
import { NewTagFormModel } from '../../../models/tags/newTagFormModel';
import { createBudgetTag } from '../../../api/tagService';

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
}: BudgetItemDrawerProps): JSX.Element => {
  const [budgetItemForm] = useForm<BudgetItemDrawerModel>();
  const [isLoading, setIsLoading] = useState(true);

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

  const onNewTagCreate = async (tagData: NewTagData): Promise<void> => {
    const { data: createdTag } = await createBudgetTag({
      budgetId: budgetId,
      label: tagData.label,
      color: tagData.color,
    });

    onNewTagAdded(createdTag);
  };

  return (
    <Drawer
      title={title}
      onClose={onFormClose}
      afterOpenChange={onAfterOpenChange}
      open={isDrawerOpened}
      extra={
        !isDisabled ? (
          <Space align={'end'}>
            <Button onClick={onFormClose}>Cancel</Button>
            <Button onClick={submitForm} type="primary">
              Submit
            </Button>
          </Space>
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
            name={'tagIds'}
            tooltip={'Tags help to classify your expenses and perform analytic on them'}
            label={'Tags'}
          >
            <TagSelector
              onNewTagCreate={onNewTagCreate}
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

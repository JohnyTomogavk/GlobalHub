import { Button, DatePicker, Drawer, Form, Input, Select, Space, Spin, Typography } from 'antd';
import { InputNumber } from 'antd/lib';
import { BudgetItemOperationType } from '../../../enums/budgetItemOperationType';
import { TagSelector } from '../../../components/tagSelector/TagSelector';
import TextArea from 'antd/lib/input/TextArea';
import React, { useState } from 'react';
import { TagDto } from '../../../dto/tags/tagDto';
import { BudgetItemDrawerModel } from '../../../models/budgetItem/budgetItemDrawer/budgetItemDrawerModel';
import { useForm } from 'antd/lib/form/Form';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../../../styles.module.scss';

const { Text } = Typography;

interface BudgetItemDrawerProps {
  title: string;
  onFormCloseCallback: () => void;
  isDrawerOpened: boolean;
  budgetItemTags: TagDto[];
  isDisabled?: boolean;
  onSubmitCallback?: (budgetItemModel: BudgetItemDrawerModel) => void;
  initFormValues?: BudgetItemDrawerModel;
}

export const BudgetItemDrawer = ({
  title,
  onFormCloseCallback,
  isDrawerOpened,
  budgetItemTags,
  onSubmitCallback,
  isDisabled,
  initFormValues,
}: BudgetItemDrawerProps): JSX.Element => {
  const [budgetItemForm] = useForm<BudgetItemDrawerModel>();
  const [isLoading, setIsLoading] = useState(true);

  const submitForm = (): void => {
    const budgetItemModel = budgetItemForm.getFieldsValue();

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

  return (
    <Drawer
      destroyOnClose
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
          <Form.Item name={'title'} label={'Title'}>
            <Input placeholder={'Title'} />
          </Form.Item>
          <Form.Item name={'operationDate'} label={'Operation Date'}>
            <DatePicker
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item name={'operationCost'} label={'Operation Cost'}>
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
          <Form.Item name={'operationType'} label={'Operation Type'}>
            <Select
              allowClear
              placeholder={'Select operation type'}
              options={[
                { value: BudgetItemOperationType.Incoming, label: 'Incoming' },
                { value: BudgetItemOperationType.Outgoing, label: 'Outgoing' },
              ]}
            />
          </Form.Item>
          <Form.Item name={'tagIds'} label={'Tags'}>
            <TagSelector isTagCreatorEnabled={true} tags={budgetItemTags ?? []} />
          </Form.Item>
          <Form.Item name={'description'} label={'Description'}>
            <TextArea rows={3} disabled={isDisabled} placeholder={'Description'} />
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};

import { Button, Col, Drawer, Form, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { TagLimitDto } from '../../../dto/tagLimit/tagLimitDto';
import { useForm, useWatch } from 'antd/lib/form/Form';
import { TagSelector } from '../../../components/tagSelector/TagSelector';
import { FormListFieldData, InputNumber } from 'antd/lib';
import { LoadingOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { nameof } from '../../../helpers/objectHelper';
import { TagDto } from '../../../dto/tags/tagDto';
import styles from '../../../styles.module.scss';
import { isArray, isEqual } from 'lodash';

interface TagLimitsDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tagLimits: TagLimitDto[]) => Promise<void>;
  initialTagLimitsData: TagLimitDto[];
  budgetTags: TagDto[];
}

interface TagLimitsFormModel {
  items: TagLimitDto[];
}

export const TagLimitsDrawer = ({
  open,
  onClose,
  onSubmit,
  initialTagLimitsData,
  budgetTags,
}: TagLimitsDrawerProps): JSX.Element => {
  const [limitsForm] = useForm<TagLimitsFormModel>();
  const [selectableTags, setSelectableTags] = useState(budgetTags);
  const [isLoading, setIsLoading] = useState(true);
  const limitFormWatcher = useWatch(nameof<TagLimitsFormModel>('items'), limitsForm);

  const isFormValid = async (): Promise<boolean> => {
    try {
      await limitsForm.validateFields();

      return true;
    } catch {
      return false;
    }
  };

  const getItemsFromForm = (): TagLimitDto[] => {
    const formValues = limitsForm?.getFieldsValue().items;

    return isArray(formValues) ? formValues : [];
  };

  useEffect(() => {
    const formValues = getItemsFromForm();

    const selectedTagIds = formValues.map((tagLimit) => tagLimit.id);
    setSelectableTags(budgetTags.filter((tagDto) => !selectedTagIds.includes(tagDto.id)));
  }, [limitFormWatcher, budgetTags]);

  const onFormSubmit = async (): Promise<void> => {
    const formValidationResult = await isFormValid();

    if (!formValidationResult) return;

    const formValues = getItemsFromForm();

    const updatedLimits = formValues.map(
      (tagLimitData) =>
        ({ id: tagLimitData.id, maxExpenseOperationsSum: tagLimitData.maxExpenseOperationsSum }) as TagLimitDto
    );

    if (!isEqual(updatedLimits, initialTagLimitsData)) {
      await onSubmit(updatedLimits);
    }
  };

  const afterOpenChange = (newOpenValue: boolean): void => {
    if (!newOpenValue) {
      setIsLoading(true);

      return;
    }

    setIsLoading(false);
    limitsForm.setFieldsValue({
      items: initialTagLimitsData,
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={'Edit tag limits'}
      afterOpenChange={afterOpenChange}
      extra={
        <Button size={'small'} onClick={onFormSubmit} type="primary">
          Submit
        </Button>
      }
    >
      {isLoading ? (
        <Spin className={styles.loader} indicator={<LoadingOutlined />} />
      ) : (
        <Form
          form={limitsForm}
          initialValues={{
            items: [],
          }}
          layout={'horizontal'}
        >
          <Form.List name={nameof<TagLimitsFormModel>('items')}>
            {(fields, { add, remove }, { errors }): JSX.Element => (
              <Form.Item validateDebounce={1000} noStyle>
                {fields?.map(({ key, name, ...restField }: FormListFieldData) => (
                  <>
                    <Form.Item noStyle key={key} {...restField}>
                      <Row>
                        <Col flex={'auto'}>
                          <Form.Item
                            rules={[{ required: true, message: 'Tag required' }]}
                            name={[name, nameof<TagLimitDto>('id')]}
                          >
                            <TagSelector tags={selectableTags} isSingleSelectionMode={true} />
                          </Form.Item>
                        </Col>
                        <Col offset={1}>
                          <Form.Item
                            rules={[{ required: true, message: 'Limit required' }]}
                            name={[name, nameof<TagLimitDto>('maxExpenseOperationsSum')]}
                          >
                            <InputNumber min={0.1} precision={2} placeholder={'Limit'} />
                          </Form.Item>
                        </Col>
                        <Col offset={1}>
                          <Button onClick={(): void => remove(name)} danger icon={<MinusOutlined />} />
                        </Col>
                      </Row>
                    </Form.Item>
                  </>
                ))}
                <Form.ErrorList errors={errors} />
                <Button block onClick={add} icon={<PlusOutlined />}>
                  Create new limit
                </Button>
              </Form.Item>
            )}
          </Form.List>
        </Form>
      )}
    </Drawer>
  );
};

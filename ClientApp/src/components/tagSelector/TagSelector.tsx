import { TagDto } from '../../dto/tags/tagDto';
import { Button, Col, ColorPicker, Form, Input, Popover, Row, Select, Tag } from 'antd';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { ReactNode, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import styles from './tagSelector.module.scss';
import { NewTagFormModel } from '../../models/tags/newTagFormModel';

export interface NewTagData {
  label: string;
  color: string;
}

interface TagSelectorProps {
  tags: TagDto[];
  isTagCreatorEnabled?: boolean;
  onNewTagCreate?: (newTagData: NewTagData) => Promise<void>;
}

export const TagSelector = ({
  tags,
  isTagCreatorEnabled,
  onNewTagCreate,
  ...defaultProps
}: TagSelectorProps): JSX.Element => {
  const [newTagForm] = useForm<NewTagFormModel>();
  const [isTagCreatorVisible, setIsTagCreatorVisible] = useState(false);

  const defaultNewTagColor = '#808080';

  const isTagFormValid = async (): Promise<boolean> => {
    try {
      await newTagForm.validateFields();

      return true;
    } catch {
      return false;
    }
  };

  const onNewTagAdded = async (): Promise<void> => {
    const isFormValid = await isTagFormValid();

    if (isFormValid) {
      const formTagData = newTagForm.getFieldsValue();

      const tagData = {
        label: formTagData.label,
        color: formTagData.color ? formTagData.color.toHexString() : defaultNewTagColor,
      };

      if (onNewTagCreate) {
        await onNewTagCreate(tagData);
        setIsTagCreatorVisible(false);
      }
    }
  };

  return (
    <Row>
      <Col flex={'auto'}>
        <Select
          allowClear
          mode="multiple"
          tagRender={(tagProps: CustomTagProps): JSX.Element => {
            const { label, value: tagId, closable, onClose } = tagProps;

            const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>): void => {
              event.preventDefault();
              event.stopPropagation();
            };

            const tagColor = tags.filter((tag) => tag.id === tagId)[0].color;

            return (
              <Tag
                onClick={(): void => {
                  // TODO: Handle edit logic
                }}
                color={tagColor}
                closable={closable}
                onClose={onClose}
                onMouseDown={onPreventMouseDown}
                className={styles.selectedTag}
              >
                {label}
              </Tag>
            );
          }}
          placeholder={'Find tags'}
          options={[
            ...(tags.map((tagDto: TagDto) => ({
              value: tagDto.id,
              label: tagDto.label,
            })) ?? []),
          ]}
          listItemHeight={5}
          virtual={false}
          {...defaultProps}
        />
      </Col>
      {isTagCreatorEnabled ? (
        <Popover
          title={'Create new tag'}
          trigger={'click'}
          open={isTagCreatorVisible}
          placement={'left'}
          content={
            <Form form={newTagForm}>
              <Row>
                <Col>
                  <Form.Item rules={[{ message: 'Label cannot be empty', required: true }]} name={'label'}>
                    <Input placeholder="Label" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name={'color'}>
                    <ColorPicker
                      trigger={'click'}
                      showText={(): ReactNode => 'Color'}
                      disabledAlpha={true}
                      presets={[
                        {
                          label: 'Recommended',
                          colors: [
                            '#000000',
                            '#808080',
                            '#F5222D',
                            '#FA8C16',
                            '#FADB14',
                            '#8BBB11',
                            '#52C41A',
                            '#13A8A8',
                            '#1677FF',
                            '#2F54EB',
                            '#722ED1',
                            '#EB2F96',
                          ],
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button block onClick={onNewTagAdded} type={'primary'} icon={<PlusOutlined />}>
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          }
        >
          <Col>
            <Button
              onClick={(): void => {
                setIsTagCreatorVisible((prevState) => !prevState);
              }}
              icon={<PlusOutlined />}
            />
          </Col>
        </Popover>
      ) : (
        <></>
      )}
    </Row>
  );
};

import { TagDto } from '../../dto/tags/tagDto';
import { Button, Col, Drawer, Form, Input, Popconfirm, Row, Select, Tag, Typography } from 'antd';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { ReactElement, useState } from 'react';

import { useForm } from 'antd/lib/form/Form';
import styles from './tagSelector.module.scss';
import { TagFormModel } from '../../models/tags/tagFormModel';
import { MoreOutlined } from '@ant-design/icons';
import { ColorSelector } from '../colorSelector/ColorSelector';
import { ColorValues, TagColor } from '../../enums/tagColor';
import { isEqual } from 'lodash';
import { nameof } from '../../helpers/objectHelper';

interface TagSelectorProps {
  tags: TagDto[];
  isTagCreatorEnabled?: boolean;
  onTagUpdated?: (tagData: TagDto) => Promise<void>;
  onTagDelete?: (tagId: number) => Promise<void>;
}

const Option = Select.Option;
const { Text } = Typography;

const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>): void => {
  event.preventDefault();
  event.stopPropagation();
};

export const TagSelector = ({
  tags,
  isTagCreatorEnabled,
  onTagUpdated,
  onTagDelete,
  ...defaultProps
}: TagSelectorProps): JSX.Element => {
  const [tagEditForm] = useForm<TagFormModel>();
  const [isTagEditDrawerOpened, setIsTagEditDrawerOpened] = useState(false);
  const defaultTagColor = ColorValues[TagColor.Default];

  const handleTagEditDrawerClose = async (): Promise<void> => {
    if (!onTagUpdated) {
      return;
    }

    const tagFormModel = tagEditForm.getFieldsValue();
    const updatedTagModel = { ...tagFormModel };
    const initTagModel = tags.filter((tag) => tag.id === tagFormModel.id)[0];

    if (!isEqual(initTagModel, updatedTagModel)) {
      await onTagUpdated(updatedTagModel);
    }
  };

  const onTagEditDrawerSubmit = async (): Promise<void> => {
    await handleTagEditDrawerClose();

    setIsTagEditDrawerOpened(false);
  };

  const onTagEditDrawerCancel = async (): Promise<void> => {
    setIsTagEditDrawerOpened(false);
  };

  const onTagDeleteConfirm = async (): Promise<void> => {
    if (onTagDelete) {
      const tagIdToDelete = tagEditForm.getFieldValue('id') as number;
      await onTagDelete(tagIdToDelete);
    }

    setIsTagEditDrawerOpened(false);
  };

  return (
    <>
      <Drawer
        title={'Edit tag'}
        width={300}
        open={isTagEditDrawerOpened}
        onClose={onTagEditDrawerCancel}
        extra={
          <Button size={'small'} onClick={onTagEditDrawerSubmit} type="primary">
            Submit
          </Button>
        }
      >
        <Form form={tagEditForm} size={'small'} layout={'vertical'}>
          <Form.Item hidden={true} name={nameof<TagFormModel>('id')} />
          <Form.Item label={'Tag label'} name={nameof<TagFormModel>('label')}>
            <Input placeholder={'Tag label'} />
          </Form.Item>
          <Form.Item label={'Tag color'} name={nameof<TagFormModel>('color')}>
            <ColorSelector />
          </Form.Item>
        </Form>
        <Popconfirm
          title="Delete the tag"
          description="Are you sure to delete this tag?"
          placement={'bottom'}
          onConfirm={onTagDeleteConfirm}
        >
          <Button block danger>
            Delete
          </Button>
        </Popconfirm>
      </Drawer>
      <Select
        allowClear
        mode={isTagCreatorEnabled ? 'tags' : 'multiple'}
        tagRender={(tagProps: CustomTagProps): ReactElement => {
          const isTagJustCreated = typeof tagProps.value === 'string';

          const { value: tagId, closable, onClose } = tagProps;

          const tagDto = tags.filter((tag) => tag.id === tagId)[0];

          if (!tagDto) return <></>;

          const tagColor = isTagJustCreated ? defaultTagColor : ColorValues[tagDto.color];
          const tagLabel = isTagJustCreated ? tagProps.label : tagDto.label;

          return (
            <Tag
              onMouseDown={onPreventMouseDown}
              color={tagColor}
              closable={closable}
              onClose={onClose}
              className={styles.selectedTag}
            >
              {tagLabel}
            </Tag>
          );
        }}
        placeholder={'Find tags'}
        menuItemSelectedIcon={null}
        {...defaultProps}
      >
        {tags.map((tag: TagDto) => (
          <Option key={tag.id} value={tag.id}>
            <Row>
              <Col flex={'auto'}>
                <Text>{tag.label}</Text>
              </Col>
              <Col>
                {isTagCreatorEnabled ? (
                  <div>
                    <Button
                      type={'text'}
                      icon={<MoreOutlined />}
                      onClick={(event: React.MouseEvent<HTMLElement>): void => {
                        event.stopPropagation();

                        const tagModel = tags.filter((tagDto) => tagDto.id == tag.id)[0];
                        tagEditForm.setFieldsValue({
                          id: tag.id,
                          label: tagModel.label,
                          color: tagModel.color,
                        });

                        setIsTagEditDrawerOpened(true);
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          </Option>
        ))}
      </Select>
    </>
  );
};

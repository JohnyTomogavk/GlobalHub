import { TagDto } from '../../dto/tags/tagDto';
import {
  Button,
  Col,
  ColorPicker,
  Divider,
  Dropdown,
  Form,
  Input,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from 'antd';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { ReactElement, ReactNode, useEffect, useId, useState } from 'react';

import { useForm } from 'antd/lib/form/Form';
import styles from './tagSelector.module.scss';
import { NewTagFormModel } from '../../models/tags/newTagFormModel';
import FormItem from 'antd/lib/form/FormItem';
import { FontColorsOutlined, MoreOutlined } from '@ant-design/icons';
import { ColorSelector } from '../colorSelector/ColorSelector';
import { ColorValues, TagColor } from '../../enums/tagColor';

export interface NewTagData {
  label: string;
  color: TagColor;
}

interface TagSelectorProps {
  tags: TagDto[];
  isTagCreatorEnabled?: boolean;
  onTagEdit?: (tagData: TagDto) => Promise<void>;
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
  onTagEdit,
  ...defaultProps
}: TagSelectorProps): JSX.Element => {
  const [tagModelToEdit, setTagModelToEdit] = useState<TagDto>();

  const defaultTagColor = ColorValues[TagColor.Default];

  const onTagEditPopoverOpenChange = async (open: boolean): Promise<void> => {
    if (open) return;

    // TODO: get actual tag model - from form model?
    // call api to update tag
    // update tags state with updated tag
  };

  const onTagDelete = async (tagId: number): Promise<void> => {
    // TODO: Call api to delete tag
    // update tags state
  };

  // TODO: Review all the handlers below before commit edit tag feature
  return (
    <>
      <Select
        allowClear
        mode={isTagCreatorEnabled ? 'tags' : 'multiple'}
        tagRender={(tagProps: CustomTagProps): ReactElement => {
          const isTagJustCreated = typeof tagProps.value === 'string';

          const { value: tagId, closable, onClose } = tagProps;

          const tagDto = tags.filter((tag) => tag.id === tagId)[0];
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
        dropdownRender={(menu: ReactElement): ReactElement => (
          <div
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>): void => {
              if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            onMouseDown={(event): void => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onClick={(event): void => {
              // event.preventDefault();
            }}
          >
            {menu}
          </div>
        )}
        getPopupContainer={(triggerNode: HTMLElement): HTMLElement => triggerNode.parentElement ?? document.body}
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
                <Popover
                  zIndex={1051}
                  trigger={'click'}
                  placement={'right'}
                  onOpenChange={onTagEditPopoverOpenChange}
                  content={
                    <div
                      onMouseDown={(event): void => {
                        event.stopPropagation();
                        // event.preventDefault();uj
                      }}
                      onClick={(event): void => {
                        event.stopPropagation();
                      }}
                    >
                      <Space size={'small'} direction={'vertical'}>
                        <Input value={tagModelToEdit?.label} placeholder={'Tag label'} />
                        <ColorSelector />
                        <Popconfirm
                          getPopupContainer={(triggerNode): HTMLElement => triggerNode.parentElement ?? document.body}
                          title="Delete the tag"
                          description="Are you sure to delete this tag?"
                          // onConfirm={onTagDelete}
                        >
                          <Button block danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </Space>
                    </div>
                  }
                >
                  <Button
                    type={'text'}
                    icon={<MoreOutlined />}
                    onMouseDown={(event: React.MouseEvent<HTMLElement>): void => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();

                      const tagModel = tags.filter((tagDto) => tagDto.id == tag.id)[0];
                      setTagModelToEdit(tagModel);
                    }}
                  />
                </Popover>
              </Col>
            </Row>
          </Option>
        ))}
      </Select>
    </>
  );
};

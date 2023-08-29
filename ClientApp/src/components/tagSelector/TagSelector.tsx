import { TagDto } from '../../dto/tags/tagDto';
import { Button, Divider, Input, InputRef, Select, Space, Tag } from 'antd';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { ReactElement, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';

interface TagSelectorProps {
  tags: TagDto[];
  isTagCreatorEnabled?: boolean;
}

export const TagSelector = (props: TagSelectorProps): JSX.Element => {
  const { tags, isTagCreatorEnabled, ...defaultProps } = props;
  const inputRef = useRef<InputRef>(null);

  const addNewTag = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
    e.preventDefault();
    const newTagName = inputRef.current?.input?.value;
    console.log(newTagName);
    // TODO: Implement API call
    inputRef.current?.focus();
  };

  return (
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
            color={tagColor}
            closable={closable}
            onClose={onClose}
            onMouseDown={onPreventMouseDown}
            style={{ marginRight: 3 }}
          >
            {label}
          </Tag>
        );
      }}
      placeholder={'Find tags'}
      style={{ width: '100%' }}
      options={[
        ...(tags.map((tagDto: TagDto) => ({
          value: tagDto.id,
          label: tagDto.label,
        })) ?? []),
      ]}
      dropdownRender={(menu: ReactElement): ReactElement =>
        isTagCreatorEnabled ? (
          <>
            {menu}
            <Divider style={{ margin: '8px 0' }} />
            <Space style={{ padding: '0 8px 4px' }}>
              <Input ref={inputRef} placeholder="New tag name" />
              <Button onClick={addNewTag} type="text" icon={<PlusOutlined />}>
                Add
              </Button>
            </Space>
          </>
        ) : (
          menu
        )
      }
      {...defaultProps}
    />
  );
};

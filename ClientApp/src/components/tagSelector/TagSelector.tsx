import { TagDto } from '../../dto/tags/tagDto';
import { Select, Tag } from 'antd';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React from 'react';
import FormItem from 'antd/lib/form/FormItem';

interface TagSelectorProps {
  formItemName: string;
  formItemLabel: string;
  tags: TagDto[];
  onTagSelected?: (tagIds: number[]) => void;
}

export const TagSelector = (props: TagSelectorProps): JSX.Element => (
  <FormItem name={props.formItemName} label={props.formItemLabel}>
    <Select
      onChange={(selectedTagIds: number[]): void => {
        if (props?.onTagSelected) {
          props.onTagSelected(selectedTagIds);
        }
      }}
      mode="multiple"
      tagRender={(tagProps: CustomTagProps): JSX.Element => {
        const { label, value: tagId, closable, onClose } = tagProps;

        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>): void => {
          event.preventDefault();
          event.stopPropagation();
        };

        const tagColor = props.tags.filter((tag) => tag.id === tagId)[0].color;

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
        ...(props.tags.map((tagDto: TagDto) => ({
          value: tagDto.id,
          label: tagDto.label,
        })) ?? []),
      ]}
    />
  </FormItem>
);

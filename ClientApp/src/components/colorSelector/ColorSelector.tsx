import { Select, Space, Typography } from 'antd';
import { ColorLabels, ColorValues, TagColor } from '../../enums/tagColor';
import { FontColorsOutlined } from '@ant-design/icons';
import React from 'react';
import { getEnumValues } from '../../helpers/enumHelper';

const { Text } = Typography;
const Option = Select.Option;

// interface ITagColorSelectorProps {}

export const ColorSelector = (props: {}): JSX.Element => (
  <Select
    getPopupContainer={(triggerNode: HTMLElement): HTMLElement => triggerNode.parentElement ?? document.body}
    {...props}
  >
    {getEnumValues(TagColor).map((colorValue, _) => {
      const tagLabel = ColorLabels[colorValue as TagColor];
      const tagColor = ColorValues[colorValue as TagColor];

      return (
        <Option key={colorValue}>
          <Space>
            <FontColorsOutlined
              style={{
                color: tagColor,
              }}
            />
            <Text>{tagLabel}</Text>
          </Space>
        </Option>
      );
    })}
  </Select>
);

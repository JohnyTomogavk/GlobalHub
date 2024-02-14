import { Select, Space, Typography } from 'antd';
import { FontColorsOutlined } from '@ant-design/icons';
import React from 'react';
import { getEnumValues } from '../../helpers/enumHelper';
import { ColorLabels, ColorValues, TagColor } from '../../enums/shared/tagColor';

const { Text } = Typography;
const Option = Select.Option;

export const ColorSelector = ({ ...props }): JSX.Element => (
  <Select
    style={{
      width: '100%',
    }}
    getPopupContainer={(triggerNode: HTMLElement): HTMLElement => triggerNode.parentElement ?? document.body}
    {...props}
  >
    {getEnumValues(TagColor).map((colorValue: number, _) => {
      const tagLabel = ColorLabels[colorValue as TagColor];
      const tagColor = ColorValues[colorValue as TagColor];

      return (
        <Option key={colorValue} value={colorValue}>
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

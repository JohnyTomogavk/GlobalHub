import { Select, Space, Typography } from 'antd';
import { ColorLabels, ColorValues, BudgetTagColor } from '../../enums/Budgets/budgetTagColor';
import { FontColorsOutlined } from '@ant-design/icons';
import React from 'react';
import { getEnumValues } from '../../helpers/enumHelper';

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
    {getEnumValues(BudgetTagColor).map((colorValue, _) => {
      const tagLabel = ColorLabels[colorValue as BudgetTagColor];
      const tagColor = ColorValues[colorValue as BudgetTagColor];

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

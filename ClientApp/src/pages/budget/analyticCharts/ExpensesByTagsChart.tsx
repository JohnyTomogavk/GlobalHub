import { Pie } from '@ant-design/plots';
import React from 'react';

const spendsByTagsChartConfig = {
  appendPadding: 10,
  data: [
    {
      type: 'Tag 1',
      value: 27,
    },
    {
      type: 'Tag 2',
      value: 25,
    },
    {
      type: 'Tag 3',
      value: 18,
    },
    {
      type: 'Tag 4',
      value: 15,
    },
    {
      type: 'Tag 5',
      value: 10,
    },
    {
      type: 'Tag 6',
      value: 5,
    },
  ],
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  innerRadius: 0.6,
  label: {
    type: 'inner',
    offset: '-50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 14,
    },
  },
  interactions: [
    {
      type: 'element-selected',
    },
    {
      type: 'element-active',
    },
  ],
  statistic: {
    content: {
      style: {
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  },
};

export const ExpensesByTagsChart = (): JSX.Element => <Pie {...spendsByTagsChartConfig} />;

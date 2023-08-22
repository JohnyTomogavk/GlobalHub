// TODO: Enable the rule below when tags limits are implemented
/* eslint-disable no-magic-numbers */
import { Bullet } from '@ant-design/plots';
import React from 'react';

const balanceOnLimitsByTagsChart = {
  data: [
    {
      title: 'Tag 1',
      ranges: [30, 90, 120],
      currentValue: [65],
      target: 80,
    },
    {
      title: 'Tag 2',
      ranges: [30, 90, 120],
      currentValue: [50],
      target: 100,
    },
    {
      title: 'Tag 3',
      ranges: [30, 90, 120],
      currentValue: [40],
      target: 85,
    },
    {
      title: 'Tag 4',
      ranges: [30, 90, 120],
      currentValue: [50],
      target: 100,
    },
  ],
  measureField: 'currentValue',
  rangeField: 'ranges',
  targetField: 'target',
  xField: 'title',
  color: {
    range: ['#FFbcb8', '#FFe0b0', '#bfeec8'],
    measure: '#5B8FF9',
    target: '#39a3f4',
  },
  xAxis: {
    line: null,
  },
  yAxis: false,
};

export const BalanceOnLimitsByTagsChart = (): JSX.Element => (
  <Bullet
    data={balanceOnLimitsByTagsChart.data}
    color={balanceOnLimitsByTagsChart.color}
    xField={balanceOnLimitsByTagsChart.xField}
    xAxis={balanceOnLimitsByTagsChart.xAxis}
    yAxis={false}
    targetField={balanceOnLimitsByTagsChart.targetField}
    rangeField={balanceOnLimitsByTagsChart.rangeField}
    measureField={balanceOnLimitsByTagsChart.measureField}
  />
);

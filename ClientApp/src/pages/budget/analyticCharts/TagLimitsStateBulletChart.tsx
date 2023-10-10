import { Bullet } from '@ant-design/plots';
import React from 'react';
import { TagDto } from '../../../dto/tags/tagDto';
import { TagLimitDto } from '../../../dto/tagLimit/tagLimitDto';
import { ExpenseOperationsSumDto } from '../../../dto/budgetItems/expenseOperationsSumDto';
import { max, maxBy } from 'lodash';
import { PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING } from '../../../constants/budgetConstants';

interface TagLimitsStateBulletChartProps {
  tags: TagDto[];
  tagLimitsData: TagLimitDto[];
  expensesByTagSums: ExpenseOperationsSumDto[];
}

interface TagDataEntry {
  title: string;
  ranges: number[];
  currentValue: number[];
  target: number;
}

const balanceOnLimitsByTagsChart = {
  measureField: 'currentValue',
  rangeField: 'ranges',
  targetField: 'target',
  xField: 'title',
  color: {
    range: ['#bfeec8', '#FFe0b0', '#FFbcb8'],
    measure: '#5B8FF9',
    target: '#39a3f4',
  },
  xAxis: {
    line: null,
  },
};

const sizeConfig = {
  target: 0,
};

const getExpenseSumRanges = (tagLimit: number, maxLimitOrExpenseValue: number): number[] => {
  if (tagLimit === 0) {
    return [maxLimitOrExpenseValue + maxLimitOrExpenseValue * PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING];
  }

  const greenRange = tagLimit - tagLimit * PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING;
  const yellowRange = tagLimit + tagLimit * PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING;
  const redRange =
    maxLimitOrExpenseValue + maxLimitOrExpenseValue * PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING;

  return [greenRange, yellowRange, redRange];
};

export const TagLimitsStateBulletChart = ({
  tags,
  tagLimitsData,
  expensesByTagSums,
}: TagLimitsStateBulletChartProps): JSX.Element => {
  const maxExpenseOrLimitValue =
    max([
      maxBy(tagLimitsData, (lim) => lim.maxExpenseOperationsSum)?.maxExpenseOperationsSum ?? 1,
      maxBy(expensesByTagSums, (expense) => expense.operationsSum)?.operationsSum ?? 1,
    ]) ?? 1;

  const data: TagDataEntry[] = tags
    .map((tagDto) => {
      const expenseSumOnTag = expensesByTagSums.find((sum) => sum.tagId === tagDto.id)?.operationsSum ?? 0;
      const tagLimit = tagLimitsData.find((limit) => limit.id === tagDto.id)?.maxExpenseOperationsSum ?? 0;

      const sumRanges = getExpenseSumRanges(tagLimit, maxExpenseOrLimitValue);

      return {
        title: tagDto.label,
        ranges: sumRanges,
        currentValue: [expenseSumOnTag],
        target: 0,
      };
    })
    .sort((a, b) => a.currentValue[0] - b.currentValue[0]);

  return (
    <Bullet
      data={data}
      color={balanceOnLimitsByTagsChart.color}
      xField={balanceOnLimitsByTagsChart.xField}
      xAxis={balanceOnLimitsByTagsChart.xAxis}
      yAxis={false}
      size={sizeConfig}
      targetField={balanceOnLimitsByTagsChart.targetField}
      rangeField={balanceOnLimitsByTagsChart.rangeField}
      measureField={balanceOnLimitsByTagsChart.measureField}
    />
  );
};
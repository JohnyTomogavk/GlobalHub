import React from 'react';
import { TagDto } from '../../../dto/tags/tagDto';
import { TagLimitDto } from '../../../dto/tagLimit/tagLimitDto';
import { ExpenseOperationsSumDto } from '../../../dto/budgetItems/expenseOperationsSumDto';
import { max, maxBy } from 'lodash';
import { nameof } from '../../../helpers/objectHelper';
import { PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING } from '../../../constants/budgetConstants';
import Bullet from '@ant-design/plots/lib/components/bullet';
import { BulletConfig } from '@ant-design/plots';

interface TagLimitsStateBulletChartProps {
  tags: TagDto[];
  tagLimitsData: TagLimitDto[];
  expensesByTagSums: ExpenseOperationsSumDto[];
}

interface TagDataEntry {
  title: string;
  ranges: number[];
  measure: number[];
  target: number;
}

const getChartColorZonesEndsForTagLimit = (tagLimit: number, maxLimitOrExpenseValue: number): number[] => {
  if (tagLimit === 0) {
    return [maxLimitOrExpenseValue];
  }

  const greenRangeEnd = tagLimit - tagLimit * PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING;

  return [greenRangeEnd, tagLimit, maxLimitOrExpenseValue];
};

export const TagLimitsStateBulletChart = ({
  tags,
  tagLimitsData,
  expensesByTagSums,
}: TagLimitsStateBulletChartProps): JSX.Element => {
  const maxFromExpensesSumsAndLimits =
    max([
      maxBy(tagLimitsData, (lim) => lim.maxExpenseOperationsSum)?.maxExpenseOperationsSum ?? 1,
      maxBy(expensesByTagSums, (expense) => expense.operationsSum)?.operationsSum ?? 1,
    ]) ?? 1;

  const data: TagDataEntry[] = tags
    .map((tagDto) => {
      const expenseSumOnTag = expensesByTagSums.find((sum) => sum.tagId === tagDto.id)?.operationsSum ?? 0;
      const tagLimit = tagLimitsData.find((limit) => limit.id === tagDto.id)?.maxExpenseOperationsSum ?? 0;

      const sumRanges = getChartColorZonesEndsForTagLimit(tagLimit, maxFromExpensesSumsAndLimits);

      return {
        title: tagDto.label,
        ranges: sumRanges,
        measure: [expenseSumOnTag],
        target: 0,
      } as TagDataEntry;
    })
    .sort((a, b) => a.measure[0] - b.measure[0]);

  const balanceOnLimitsByTagsChart: BulletConfig = {
    data: data,
    measureField: nameof<TagDataEntry>('measure'),
    rangeField: nameof<TagDataEntry>('ranges'),
    targetField: nameof<TagDataEntry>('target'),
    xField: nameof<TagDataEntry>('title'),
    size: {
      target: 0,
    },
    color: {
      range: ['#bfeec8', '#FFe0b0', '#FFbcb8'],
      measure: '#5B8FF9',
      target: '#39a3f4',
    },
    xAxis: {
      line: null,
    },
    yAxis: false,
    layout: 'horizontal',
  };

  return <Bullet {...balanceOnLimitsByTagsChart} />;
};

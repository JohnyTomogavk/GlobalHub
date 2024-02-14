import { Pie } from '@ant-design/plots';
import React from 'react';
import { ExpenseOperationsSumDto } from '../../../dto/budgetItems/expenseOperationsSumDto';
import { TagDto } from '../../../dto/budgetTags/tagDto';

const spendsByTagsChartConfig = {
  appendPadding: 10,
  angleField: 'value',
  colorField: 'type',
  radius: 1,
  label: {
    type: 'inner',
    offset: '50%',
    content: '{value}',
    style: {
      textAlign: 'center',
      fontSize: 16,
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

interface ExpensesByTagsChartProps {
  tags: TagDto[];
  tagExpensesSums: ExpenseOperationsSumDto[];
}

interface TagChartEntry {
  type: string;
  value: number;
}

export const ExpensesByTagsChart = ({ tags, tagExpensesSums }: ExpensesByTagsChartProps): JSX.Element => {
  const data: TagChartEntry[] = tagExpensesSums.map((tagExpensesSum) => {
    const tagLabel = tags.find((tagDto) => tagDto.id === tagExpensesSum.tagId)?.label ?? 'Unknown';

    return {
      type: tagLabel,
      value: tagExpensesSum.operationsSum,
    };
  });

  return <Pie {...spendsByTagsChartConfig} data={data} />;
};

import React, { useEffect, useState } from 'react';
import { Area } from '@ant-design/plots';
import { getExpensesSumsByDaysForLast2Month } from '../../../api/budgetItemService';
import { HttpStatusCode } from 'axios';
import { nameof } from '../../../helpers/objectHelper';
import dayjs from 'dayjs';
import { Empty } from 'antd';

interface ExpensesDistributionByDaysChartProps {
  budgetId: number;
}

interface ExpenseDistributionByDaysChartEntry {
  monthLabel: string;
  date: number;
  value: number;
}

const distributionByDaysConfig = {
  xField: nameof<ExpenseDistributionByDaysChartEntry>('date'),
  yField: nameof<ExpenseDistributionByDaysChartEntry>('value'),
  seriesField: nameof<ExpenseDistributionByDaysChartEntry>('monthLabel'),
  isGroup: true,
  meta: {
    date: {
      type: 'linear',
      tickCount: 31,
      tickInterval: 1,
    },
  },
};

export const ExpensesDistributionByDaysChart = ({ budgetId }: ExpensesDistributionByDaysChartProps): JSX.Element => {
  const [operationSumsByDays, setOperationSumsByDays] = useState<ExpenseDistributionByDaysChartEntry[]>([]);
  const today = dayjs();
  const monthsNumbersToCompare = [today.add(-1, 'months').month(), today.month()];

  const loadOperationSumsByDays = async (): Promise<void> => {
    const { data: expenseData, status } = await getExpensesSumsByDaysForLast2Month(budgetId);

    if (status !== HttpStatusCode.Ok) {
      setOperationSumsByDays([]);

      return;
    }

    const chartData: ExpenseDistributionByDaysChartEntry[] = [];

    monthsNumbersToCompare.forEach((monthNumber) => {
      for (let dayNumber = 1; dayNumber <= today.get('date'); dayNumber++) {
        const dateSumsModel = expenseData.find((dto) => {
          const date = new Date(dto.operationDate);

          return date.getMonth() === monthNumber && date.getDate() === dayNumber;
        });

        let chartEntry: ExpenseDistributionByDaysChartEntry;

        if (dateSumsModel) {
          chartEntry = {
            monthLabel: new Date(dateSumsModel.operationDate).toLocaleString('en-US', {
              month: 'long',
            }),
            value: dateSumsModel.operationCostsSum,
            date: dayNumber,
          };
        } else {
          const date = today.set('month', monthNumber).set('date', dayNumber);

          chartEntry = {
            monthLabel: date.toDate().toLocaleString('en-US', {
              month: 'long',
            }),
            value: 0,
            date: dayNumber,
          };
        }

        chartData.push(chartEntry);
      }
    });

    setOperationSumsByDays(chartData);
  };

  useEffect(() => {
    loadOperationSumsByDays();
  }, [budgetId]);

  return operationSumsByDays.length ? (
    <Area data={operationSumsByDays} {...distributionByDaysConfig} />
  ) : (
    <Empty description={'There is not enough data to show analytic on your expenses'} />
  );
};

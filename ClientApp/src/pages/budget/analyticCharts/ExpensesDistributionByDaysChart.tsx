import React, { useEffect, useState } from 'react';
import { Area } from '@ant-design/plots';
import { getBudgetItemsByBudgetIdAndDates } from '../../../api/budgetItemService';
import { HttpStatusCode } from 'axios';
import { nameof } from '../../../helpers/objectHelper';
import dayjs from 'dayjs';
import { Empty } from 'antd';
import { BudgetItemDto } from '../../../dto/budgets/budgetItemDto';
import { forOwn, groupBy, sumBy } from 'lodash';
import { BudgetItemExpenseSumByDay } from '../../../dto/budgetItems/budgetItemExpenseSumByDay';
import { ExpenseDistributionByDaysChartEntry } from '../../../models/analyticCharts/ExpenseDistributionByDaysChartEntry';

interface ExpensesDistributionByDaysChartProps {
  budgetId: number;
}

const distributionByDaysChartConfig = {
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

const getMonthLabel = (date: Date): string =>
  date.toLocaleString('en-US', {
    month: 'long',
  });

export const ExpensesDistributionByDaysChart = ({ budgetId }: ExpensesDistributionByDaysChartProps): JSX.Element => {
  const [chartEntries, setChartEntries] = useState<ExpenseDistributionByDaysChartEntry[]>([]);

  const today = dayjs();
  const monthsNumbersToCompare = [today.add(-1, 'months').month(), today.month()];

  const getGroupedSumsByDate = (budgetItems: BudgetItemDto[]): BudgetItemExpenseSumByDay[] => {
    const budgetItemParsedData = budgetItems.map((dto) => ({
      ...dto,
      operationDate: dayjs(dto.operationDate).startOf('date').toDate(),
    }));

    const operationSumsGroupedByOperationDate = groupBy(
      budgetItemParsedData,
      (budgetItemDto) => budgetItemDto.operationDate
    );

    const sumsByDays: BudgetItemExpenseSumByDay[] = [];

    forOwn(operationSumsGroupedByOperationDate, (values: BudgetItemDto[], key: string) => {
      sumsByDays.push({
        operationDate: new Date(key),
        operationCostsSum: sumBy(values, (dto) => dto.operationCost),
      });
    });

    return sumsByDays;
  };

  const convertToChartEntries = (
    sumsGroupedByDays: BudgetItemExpenseSumByDay[]
  ): ExpenseDistributionByDaysChartEntry[] => {
    const chartData: ExpenseDistributionByDaysChartEntry[] = [];

    monthsNumbersToCompare.forEach((monthNumber) => {
      for (let dayNumber = 1; dayNumber <= today.get('date'); dayNumber++) {
        const dateSumsModel = sumsGroupedByDays.find((dto) => {
          const date = new Date(dto.operationDate);

          return date.getMonth() === monthNumber && date.getDate() === dayNumber;
        });

        let chartEntry: ExpenseDistributionByDaysChartEntry;

        if (dateSumsModel) {
          chartEntry = {
            monthLabel: getMonthLabel(new Date(dateSumsModel.operationDate)),
            value: dateSumsModel.operationCostsSum,
            date: dayNumber,
          };
        } else {
          const date = today.set('month', monthNumber).set('date', dayNumber);

          chartEntry = {
            monthLabel: getMonthLabel(date.toDate()),
            value: 0,
            date: dayNumber,
          };
        }

        chartData.push(chartEntry);
      }
    });

    return chartData;
  };

  const loadBudgetItems = async (): Promise<void> => {
    const previousMonthStartDate = dayjs().add(-1, 'months').set('date', 1).startOf('day');
    const currentMonthEndDate = dayjs().set('date', 1).add(1, 'months').add(-1, 'days').startOf('day');

    const { data: budgetItemsDtos, status } = await getBudgetItemsByBudgetIdAndDates(
      budgetId,
      previousMonthStartDate.toDate(),
      currentMonthEndDate.toDate()
    );

    if (status !== HttpStatusCode.Ok) return;

    const sumsByDays = getGroupedSumsByDate(budgetItemsDtos);
    const entries = convertToChartEntries(sumsByDays);

    setChartEntries(entries);
  };

  useEffect(() => {
    loadBudgetItems();
  }, [budgetId]);

  return chartEntries.length ? (
    <Area data={chartEntries} {...distributionByDaysChartConfig} />
  ) : (
    <Empty description={'There is not enough data to perform analytic on your expenses'} />
  );
};

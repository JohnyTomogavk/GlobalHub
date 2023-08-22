import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Col, Collapse, Form, Progress, Result, Row, Space, Statistic, Tooltip, Typography } from 'antd';
import styles from './budjet.module.scss';
import { useParams } from 'react-router-dom';
import { getBudgetAnalyticForCurrentMonthById, getBudgetById } from '../../api/budgetsService';
import { toNumber } from 'lodash';
import { BudgetDto } from '../../dto/budgets/budgetDto';
import { Area, Bullet, Pie } from '@ant-design/plots';
import CountUp from 'react-countup';
import { valueType } from 'antd/es/statistic/utils';
import { EditOutlined } from '@ant-design/icons';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import Paragraph from 'antd/es/typography/Paragraph';
import { BudgetAnalyticDto } from '../../dto/budgets/budgetAnalyticDto';
import { TagDto } from '../../dto/tags/tagDto';
import { getBudgetTags } from '../../api/tagService';
import { BudgetItemsTable } from './budgetItemsTable/BudgetItemsTable';

const { Text } = Typography;

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

const distributionByDays = {
  data: [
    { country: 'Prev month', date: 1965, value: 1390.5 },
    { country: 'Prev month', date: 1966, value: 1469.5 },
    { country: 'Prev month', date: 1967, value: 1521.7 },
    { country: 'Prev month', date: 1968, value: 1615.9 },
    { country: 'Prev month', date: 1969, value: 1703.7 },
    { country: 'Prev month', date: 1970, value: 1767.8 },
    { country: 'Prev month', date: 1971, value: 1806.2 },
    { country: 'Prev month', date: 1972, value: 1903.5 },
    { country: 'Prev month', date: 1973, value: 1986.6 },
    { country: 'Prev month', date: 1974, value: 1952 },
    { country: 'Prev month', date: 1975, value: 1910.4 },
    { country: 'Prev month', date: 1976, value: 2015.8 },
    { country: 'Prev month', date: 1977, value: 2074.7 },
    { country: 'Prev month', date: 1978, value: 2092.7 },
    { country: 'Prev month', date: 1979, value: 2123.8 },
    { country: 'Prev month', date: 1980, value: 2068.3 },
    { country: 'Prev month', date: 1981, value: 2018 },
    { country: 'Prev month', date: 1982, value: 1951.5 },
    { country: 'Prev month', date: 1983, value: 1941.1 },
    { country: 'Prev month', date: 1984, value: 2046.2 },
    { country: 'Prev month', date: 1985, value: 2053.1 },
    { country: 'Prev month', date: 1986, value: 2060.7 },
    { country: 'Prev month', date: 1987, value: 2130.8 },
    { country: 'Prev month', date: 1988, value: 2223.5 },
    { country: 'Prev month', date: 1989, value: 2275.9 },
    { country: 'Prev month', date: 1990, value: 2280.7 },
    { country: 'Prev month', date: 1991, value: 2282 },
    { country: 'Prev month', date: 1992, value: 2319.7 },
    { country: 'Prev month', date: 1993, value: 2366.6 },
    { country: 'Prev month', date: 1994, value: 2420.2 },
    { country: 'Prev month', date: 1995, value: 2466.9 },
    { country: 'Prev month', date: 1996, value: 2547.4 },
    { country: 'Current', date: 1965, value: 109.2 },
    { country: 'Current', date: 1966, value: 115.7 },
    { country: 'Current', date: 1967, value: 120.5 },
    { country: 'Current', date: 1968, value: 128 },
    { country: 'Current', date: 1969, value: 134.4 },
    { country: 'Current', date: 1970, value: 142.2 },
    { country: 'Current', date: 1971, value: 157.5 },
    { country: 'Current', date: 1972, value: 169.5 },
    { country: 'Current', date: 1973, value: 186.3 },
    { country: 'Current', date: 1974, value: 195.5 },
    { country: 'Current', date: 1975, value: 198 },
    { country: 'Current', date: 1976, value: 211.7 },
    { country: 'Current', date: 1977, value: 223.8 },
    { country: 'Current', date: 1978, value: 236.5 },
    { country: 'Current', date: 1979, value: 251.8 },
    { country: 'Current', date: 1980, value: 262.9 },
    { country: 'Current', date: 1981, value: 262.7 },
    { country: 'Current', date: 1982, value: 265.9 },
    { country: 'Current', date: 1983, value: 268.3 },
    { country: 'Current', date: 1984, value: 278.3 },
    { country: 'Current', date: 1985, value: 285.2 },
    { country: 'Current', date: 1986, value: 304.2 },
    { country: 'Current', date: 1987, value: 315.4 },
    { country: 'Current', date: 1988, value: 324.6 },
    { country: 'Current', date: 1989, value: 329.9 },
    { country: 'Current', date: 1990, value: 331.1 },
    { country: 'Current', date: 1991, value: 339.7 },
    { country: 'Current', date: 1992, value: 355.8 },
    { country: 'Current', date: 1993, value: 368.8 },
    { country: 'Current', date: 1994, value: 390.9 },
    { country: 'Current', date: 1995, value: 408.3 },
    { country: 'Current', date: 1996, value: 425.8 },
    { country: 'Current', date: 1997, value: 448.2 },
    { country: 'Current', date: 1998, value: 465.5 },
    { country: 'Current', date: 1999, value: 463.7 },
    { country: 'Current', date: 2000, value: 476.1 },
    { country: 'Current', date: 2001, value: 477.7 },
    { country: 'Current', date: 2002, value: 483.5 },
    { country: 'Current', date: 2003, value: 489.3 },
  ],
  xField: 'date',
  yField: 'value',
  seriesField: 'country',
  slider: {
    start: 0,
    end: 1,
  },
};

const countUpFormatter = (value: valueType): ReactNode => <CountUp end={+value} separator="," />;

export const BudgetComponent = (): JSX.Element => {
  const { id } = useParams();
  const [budgetDto, setBudgetDto] = useState<BudgetDto | undefined>();
  const [budgetAnalyticData, setBudgetAnalyticData] = useState<BudgetAnalyticDto | undefined>();
  const [budgetTags, setBudgetTags] = useState<TagDto[] | undefined>(undefined);

  const loadBudgetData = async (budgetId: number): Promise<void> => {
    const [{ data: budget }, { data: budgetAnalytic }, { data: tags }] = await Promise.all([
      getBudgetById(budgetId),
      getBudgetAnalyticForCurrentMonthById(budgetId),
      getBudgetTags(budgetId),
    ]);

    setBudgetDto(budget);
    setBudgetAnalyticData(budgetAnalytic);
    setBudgetTags(tags);
  };

  useEffect(() => {
    if (!id) return;

    const budgetId = toNumber(id);
    loadBudgetData(budgetId);
  }, [id]);

  return (
    <>
      <ItemInfoSubHeader
        onDeleteCallback={(): void => {
          console.log('delete');
        }}
        breadCrumbsItems={[{ title: 'Budgets' }, { title: 'Budget 2' }]}
        lastEdited={budgetDto?.updatedDate ?? budgetDto?.createdDate}
        isLoading={false}
      />
      <div className={styles.pageContent}>
        <Row className={styles.budgetRow} gutter={[8, 8]}>
          <Col span={10}>
            <Card size={'small'} className={styles.budgetInfoCard} title="Budget info">
              <Form layout={'vertical'} size={'small'}>
                <Form.Item className={styles.budgetDescriptionFormField} label={<Text strong>Budget title:</Text>}>
                  <Paragraph
                    editable={{
                      onChange: (updatedTitle: string): void => {
                        setBudgetDto((oldValue) => {
                          if (!oldValue) return undefined;

                          return {
                            ...oldValue,
                            budgetTitle: updatedTitle,
                          };
                        });

                        // TODO: Implement title update
                      },
                    }}
                  >
                    {budgetDto?.budgetTitle}
                  </Paragraph>
                </Form.Item>
                <Form.Item
                  className={styles.budgetDescriptionFormField}
                  label={<Text strong>Budget description:</Text>}
                >
                  <Paragraph
                    editable={{
                      onChange: (updatedDescription: string): void => {
                        setBudgetDto((oldValue) => {
                          if (!oldValue) return undefined;

                          return {
                            ...oldValue,
                            budgetDescription: updatedDescription,
                          };
                        });

                        // TODO: Implement description update
                      },
                    }}
                  >
                    {budgetDto?.budgetDescription}
                  </Paragraph>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col flex={'auto'}>
            <Card
              size={'small'}
              style={{
                height: '100%',
              }}
              title="Current month balance state"
            >
              <Space size={'large'}>
                <Space direction={'vertical'}>
                  <Statistic
                    title="Left"
                    suffix={'BYN'}
                    value={budgetAnalyticData?.moneyLeft}
                    formatter={countUpFormatter}
                    precision={2}
                  />
                  <Statistic
                    title="Expenses"
                    suffix={'BYN'}
                    value={budgetAnalyticData?.irregularExpenses}
                    formatter={countUpFormatter}
                    precision={2}
                  />
                </Space>
                <Space direction={'vertical'}>
                  <Statistic
                    title="Preserved"
                    suffix={'BYN'}
                    value={budgetAnalyticData?.moneyPreserved}
                    formatter={countUpFormatter}
                    precision={2}
                  />
                  <Statistic
                    title="Regular expenses"
                    suffix={'BYN'}
                    value={budgetAnalyticData?.regularExpenses}
                    formatter={countUpFormatter}
                    precision={2}
                  />
                </Space>
              </Space>
            </Card>
          </Col>
          <Col flex={'auto'}>
            <Card
              size={'small'}
              style={{
                height: '100%',
              }}
              title={'Budget analytic'}
            >
              <Space direction={'vertical'}>
                <Statistic
                  value={budgetAnalyticData?.averageDailyExpenses}
                  formatter={countUpFormatter}
                  precision={2}
                  title="Avg daily expenses"
                  suffix={'BYN'}
                />
                <Statistic
                  value={budgetAnalyticData?.expensesMedian}
                  formatter={countUpFormatter}
                  precision={2}
                  title="Expenses median"
                  suffix={'BYN'}
                />
              </Space>
            </Card>
          </Col>
          <Col>
            <Card
              size={'small'}
              style={{
                height: '100%',
              }}
              title={'Preserve'}
              extra={<Button size={'small'} icon={<EditOutlined />} />}
            >
              <Space direction="vertical" align="center">
                <Tooltip title="Preserved from incoming">
                  <Progress type="dashboard" percent={budgetDto?.preserveFromIncomingPercent} />
                </Tooltip>
                {/* <Button.Group> */}
                {/*   <Button icon={<MinusOutlined />} /> */}
                {/*   <Button icon={<PlusOutlined />} /> */}
                {/*   <Button icon={<SaveOutlined />}>Save</Button> */}
                {/* </Button.Group> */}
              </Space>
            </Card>
          </Col>
          <Col flex={'auto'}>
            <Card
              size={'small'}
              style={{
                height: '100%',
              }}
              title={'Current budget status'}
            >
              <Result
                style={{
                  padding: 0,
                }}
                status="success"
                subTitle="You are on track with your limits"
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.budgetRow}>
          <Col span={24}>
            <Card size={'small'} title="Analytic charts">
              <Collapse
                size={'small'}
                items={[
                  {
                    key: 1,
                    label: 'Analytic by tags',
                    children: (
                      <Row gutter={8}>
                        <Col span={15}>
                          <Card extra={<Button>Update limits</Button>} size={'small'} title="Budget limits by tags">
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
                          </Card>
                        </Col>
                        <Col span={9}>
                          <Card size={'small'} title="Expenses by tags">
                            <Pie {...spendsByTagsChartConfig} />
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: 2,
                    label: 'Current month expenses to previous',
                    children: <Area {...distributionByDays} />,
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.budgetRow}>
          <Col flex={'auto'}>
            <Card size={'small'} title="Budget items">
              <BudgetItemsTable budgetTags={budgetTags ?? []} budgetId={toNumber(id)} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

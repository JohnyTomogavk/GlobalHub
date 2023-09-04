import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Col, Collapse, Form, Progress, Result, Row, Space, Statistic, Tooltip, Typography } from 'antd';
import styles from './budjet.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getBudgetAnalyticForCurrentMonthById,
  getBudgetById,
  updateBudgetDescription,
  updateBudgetTitle,
} from '../../api/budgetsService';
import { toNumber } from 'lodash';
import { BudgetDto } from '../../dto/budgets/budgetDto';
import CountUp from 'react-countup';
import { valueType } from 'antd/es/statistic/utils';
import { EditOutlined, MinusOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import Paragraph from 'antd/es/typography/Paragraph';
import { BudgetAnalyticDto } from '../../dto/budgets/budgetAnalyticDto';
import { TagDto } from '../../dto/tags/tagDto';
import { getBudgetTags } from '../../api/tagService';
import { BudgetItemsTable } from './budgetItemsTable/BudgetItemsTable';
import { DistributionByDaysChart } from './analyticCharts/DistributionByDaysChart';
import { BalanceOnLimitsByTagsChart } from './analyticCharts/BalanceOnLimitsByTagsChart';
import { ExpensesByTagsChart } from './analyticCharts/ExpensesByTagsChart';
import { deleteBudgetById } from '../../api/budgetItemService';
import { BUDGET_LIST_ROUTE } from '../../constants/routingConstants';
import { HttpStatusCode } from 'axios';

const { Text } = Typography;

const countUpFormatter = (value: valueType): ReactNode => <CountUp end={+value} separator="," />;

export const BudgetComponent = (): JSX.Element => {
  const { id } = useParams();
  const [budgetDto, setBudgetDto] = useState<BudgetDto | undefined>();
  const [budgetAnalyticData, setBudgetAnalyticData] = useState<BudgetAnalyticDto | undefined>();
  const [budgetTags, setBudgetTags] = useState<TagDto[]>([]);
  const navigate = useNavigate();

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

  const onBudgetTitleUpdate = async (title: string): Promise<void> => {
    if (!id) return;

    const response = await updateBudgetTitle(toNumber(id), title);
    if (response.status === HttpStatusCode.Ok) {
      setBudgetDto((oldValue) => {
        if (!oldValue) return undefined;

        return {
          ...oldValue,
          budgetTitle: title,
        };
      });
    }
  };

  const onBudgetDescriptionUpdate = async (description: string): Promise<void> => {
    if (!id) return;

    const response = await updateBudgetDescription(toNumber(id), description);
    if (response.status === HttpStatusCode.Ok) {
      setBudgetDto((oldValue) => {
        if (!oldValue) return undefined;

        return {
          ...oldValue,
          budgetDescription: description,
        };
      });
    }
  };

  const fetchAnalitycData = async (): Promise<void> => {
    if (!id) return;

    const { data: analyticData } = await getBudgetAnalyticForCurrentMonthById(toNumber(id));

    setBudgetAnalyticData(analyticData);
  };

  const onNewTagAdded = (newTag: TagDto): void => {
    setBudgetTags((tags) => [...tags, newTag]);
  };

  return (
    <>
      <ItemInfoSubHeader
        onDeleteCallback={async (): Promise<void> => {
          if (!id) return;

          await deleteBudgetById(toNumber(id));
          navigate(`/${BUDGET_LIST_ROUTE}`);
          // TODO: Remove from side menu
        }}
        breadCrumbsItems={[{ title: 'Budgets' }, { title: 'Budget 2' }]}
        lastEdited={budgetDto?.updatedDate ?? budgetDto?.createdDate}
        isLoading={false}
      />
      <div className={styles.pageContent}>
        {/* eslint-disable-next-line no-magic-numbers */}
        <Row className={styles.budgetRow} gutter={[8, 8]}>
          <Col span={10}>
            <Card size={'small'} className={styles.budgetInfoCard} title="Budget info">
              <Form layout={'vertical'} size={'small'}>
                <Form.Item className={styles.budgetDescriptionFormField} label={<Text strong>Budget title:</Text>}>
                  <Paragraph
                    editable={{
                      onChange: (updatedTitle: string): void => {
                        onBudgetTitleUpdate(updatedTitle);
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
                      onChange: (updatedDescription: string) => onBudgetDescriptionUpdate(updatedDescription),
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
                    title="Irregular Expenses"
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
                <Button.Group>
                  <Button icon={<MinusOutlined />} />
                  <Button icon={<PlusOutlined />} />
                  <Button icon={<SaveOutlined />}>Save</Button>
                </Button.Group>
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
                            <BalanceOnLimitsByTagsChart />
                          </Card>
                        </Col>
                        <Col span={9}>
                          <Card size={'small'} title="Expenses by tags">
                            <ExpensesByTagsChart />
                          </Card>
                        </Col>
                      </Row>
                    ),
                  },
                  {
                    key: 2,
                    label: 'Current month expenses to previous',
                    children: <DistributionByDaysChart />,
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
        <Row className={styles.budgetRow}>
          <Col flex={'auto'}>
            <Card size={'small'} title="Budget items">
              <BudgetItemsTable
                onNewTagAdded={onNewTagAdded}
                triggerAnalitycStatsRecalculation={fetchAnalitycData}
                budgetTags={budgetTags ?? []}
                budgetId={toNumber(id)}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Form,
  List,
  Progress,
  Result,
  Row,
  Space,
  Statistic,
  Typography,
} from 'antd';
import styles from './budjet.module.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  deleteBudgetById,
  getBudgetAnalyticForCurrentMonthById,
  getBudgetById,
  updateBudgetDescription,
  updateBudgetTitle,
  updatePreservePercent,
} from '../../api/budgetsService';
import { toNumber } from 'lodash';
import { BudgetDto } from '../../dto/budgets/budgetDto';
import CountUp from 'react-countup';
import { valueType } from 'antd/es/statistic/utils';
import { EditOutlined } from '@ant-design/icons';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import Paragraph from 'antd/es/typography/Paragraph';
import { BudgetAnalyticDto } from '../../dto/budgets/budgetAnalyticDto';
import { TagDto } from '../../dto/tags/tagDto';
import { getBudgetTags } from '../../api/tagService';
import { BudgetItemsTable } from './budgetItemsTable/BudgetItemsTable';
import { DistributionByDaysChart } from './analyticCharts/DistributionByDaysChart';
import { BalanceOnLimitsByTagsChart } from './analyticCharts/BalanceOnLimitsByTagsChart';
import { ExpensesByTagsChart } from './analyticCharts/ExpensesByTagsChart';
import { BUDGET_LIST_ROUTE } from '../../constants/routingConstants';
import { HttpStatusCode } from 'axios';
import { observer } from 'mobx-react-lite';
import SideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import { PreserveControl } from './preserveControl/PreserveControl';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { TagLimitDto } from '../../dto/tagLimit/tagLimitDto';
import { getTagLimits, updateTagLimits } from '../../api/tagLimitsService';
import { getExpensesSumsGroupedByTags } from '../../api/budgetItemService';
import { ExpenseOperationsSumDto } from '../../dto/budgetItems/expenseOperationsSumDto';
import { CURRENCY_PRECISION } from '../../constants/budgetConstants';
import { TagLimitsDrawer } from './tagLimitsDrawer/TagLimitsDrawer';

const { Text } = Typography;

const countUpFormatter = (value: valueType): ReactNode => <CountUp decimals={2} end={+value} />;

const CONVERT_TO_PERCENT_RATIO = 100;

interface TagLimitStatus {
  tagId: number;
  getTagLabel: () => string;
  operationSumLimit: number;
  currentOperationsSum: number;
  hasLimitBeenReached: boolean;
  limitAchievementPercent: number;
}

export const BudgetComponent = observer((): JSX.Element => {
  const { budgetStore, sideMenuItems } = SideMenuIndexStore;

  const { id } = useParams();
  const budgetId = toNumber(id);

  const [budgetDto, setBudgetDto] = useState<BudgetDto | undefined>();
  const [budgetAnalyticData, setBudgetAnalyticData] = useState<BudgetAnalyticDto | undefined>();
  const [budgetTags, setBudgetTags] = useState<TagDto[]>([]);
  const [isPreservePercentEditable, setIsPreservePercentEditable] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const breadCrumbsItems = useBreadcrumbs(location.pathname, sideMenuItems);

  const [tagLimits, setTagLimits] = useState<TagLimitDto[]>([]);
  const [expenseSumsGroupedByTags, setExpenseSumsGroupedByTags] = useState<ExpenseOperationsSumDto[]>([]);
  const [tagLimitsStatuses, setTagLimitsStatuses] = useState<TagLimitStatus[]>([]);
  const [isTagLimitsDrawerOpened, setIsTagLimitsDrawerOpened] = useState<boolean>(false);

  const tagLimitsResultTitle =
    tagLimitsStatuses.length === 0
      ? 'You are on track with your limits'
      : `Some of tags have reached their limits on expenses: ${tagLimitsStatuses
          .map((limitStatus) => limitStatus.getTagLabel())
          .join(', ')}`;

  const loadBudgetData = async (): Promise<void> => {
    const [{ data: budget }, { data: budgetAnalytic }, { data: tags }] = await Promise.all([
      getBudgetById(budgetId),
      getBudgetAnalyticForCurrentMonthById(budgetId),
      getBudgetTags(budgetId),
    ]);

    setBudgetDto(budget);
    setBudgetAnalyticData(budgetAnalytic);
    setBudgetTags(tags);
  };

  const handleReachedExpenseLimits = (): void => {
    if (!tagLimits.length) return;

    let tagLimitsData: TagLimitStatus[] = [];

    expenseSumsGroupedByTags.map((expenseOperationsSum) => {
      const limitForSum = tagLimits.find((limit) => limit.id === expenseOperationsSum.tagId);

      if (!limitForSum) return;

      const hasLimitBeenReached = expenseOperationsSum.operationsSum >= limitForSum.maxExpenseOperationsSum;
      const limitAchievementRatio = expenseOperationsSum.operationsSum / limitForSum.maxExpenseOperationsSum;

      const getTagLabel = (): string =>
        budgetTags.find((tag) => tag.id === expenseOperationsSum.tagId)?.label ?? 'Unknown';

      tagLimitsData.push({
        tagId: expenseOperationsSum.tagId,
        getTagLabel: getTagLabel,
        hasLimitBeenReached: hasLimitBeenReached,
        operationSumLimit: limitForSum.maxExpenseOperationsSum,
        currentOperationsSum: expenseOperationsSum.operationsSum,
        limitAchievementPercent: limitAchievementRatio * CONVERT_TO_PERCENT_RATIO,
      });
    });

    tagLimitsData = tagLimitsData.sort((a, b) => b.limitAchievementPercent - a.limitAchievementPercent);
    setTagLimitsStatuses(tagLimitsData);
  };

  const loadTagLimitsData = async (): Promise<void> => {
    const [{ data: tagLimitsDtos }, { data: expSumsGroupedByTags }] = await Promise.all([
      getTagLimits(budgetId),
      getExpensesSumsGroupedByTags(budgetId),
    ]);

    setTagLimits(tagLimitsDtos);
    setExpenseSumsGroupedByTags(expSumsGroupedByTags);
  };

  useEffect(() => {
    loadTagLimitsData();
    loadBudgetData();

    return () => {
      setTagLimitsStatuses([]);
    };
  }, [id]);

  useEffect(() => {
    handleReachedExpenseLimits();
  }, [budgetTags, expenseSumsGroupedByTags, tagLimits]);

  const onBudgetTitleUpdate = async (title: string): Promise<void> => {
    if (!id) return;

    const parsedId = toNumber(id);

    const response = await updateBudgetTitle(parsedId, title);
    if (response.status === HttpStatusCode.Ok) {
      setBudgetDto((oldValue) => {
        if (!oldValue) return undefined;

        return {
          ...oldValue,
          budgetTitle: title,
        };
      });

      budgetStore.renameBudget(parsedId, title);
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

  const fetchAnalyticData = async (): Promise<void> => {
    if (!id) return;

    const { data: analyticData } = await getBudgetAnalyticForCurrentMonthById(toNumber(id));
    setBudgetAnalyticData(analyticData);
  };

  const onNewTagAdded = (newTag: TagDto): void => {
    setBudgetTags((tags) => [...tags, newTag]);
  };

  const onPreservePercentEditClick = (): void => {
    setIsPreservePercentEditable((prevState) => !prevState);
  };

  const opPreservePercentUpdate = async (newPercentValue: number): Promise<void> => {
    if (!id) return;

    const { data: updatedBudget, status } = await updatePreservePercent(toNumber(id), newPercentValue);

    if (status === HttpStatusCode.Ok) {
      setBudgetDto(updatedBudget);
      await fetchAnalyticData();
    }

    setIsPreservePercentEditable(false);
  };

  const onTagLimitsDrawerClose = (): void => {
    setIsTagLimitsDrawerOpened(false);
  };

  const onTagLimitsDrawerSubmit = async (updatedTagLimits: TagLimitDto[]): Promise<void> => {
    const { status } = await updateTagLimits(budgetId, updatedTagLimits);

    if (status === HttpStatusCode.Ok) {
      setIsTagLimitsDrawerOpened(false);
      await loadTagLimitsData();
    }
  };

  return (
    <>
      <ItemInfoSubHeader
        onDeleteCallback={async (): Promise<void> => {
          if (!id) return;

          const parsedId = toNumber(id);
          const { status } = await deleteBudgetById(parsedId);

          if (status === HttpStatusCode.Ok) {
            navigate(`/${BUDGET_LIST_ROUTE}`);
            budgetStore.removeBudget(parsedId);
          }
        }}
        breadCrumbsItems={breadCrumbsItems}
        editedAt={budgetDto?.updatedDate}
        createdAt={budgetDto?.createdDate ?? new Date()}
        isLoading={false}
      />
      <div className={styles.pageContent}>
        {/* eslint-disable-next-line no-magic-numbers */}
        <Row className={styles.budgetRow} gutter={[8, 8]}>
          <Col span={8}>
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
            <Card size={'small'} title="Current month balance state" className={styles.card}>
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
            <Card size={'small'} title={'Operations analytic'} className={styles.card}>
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
              className={styles.preserveControlCard}
              title={'Preserve'}
              extra={<Button onClick={onPreservePercentEditClick} size={'small'} icon={<EditOutlined />} />}
            >
              <PreserveControl
                preserveFromIncomingPercent={budgetDto?.preserveFromIncomingPercent ?? 0}
                isValueEditable={isPreservePercentEditable}
                onValueUpdated={opPreservePercentUpdate}
              />
            </Card>
          </Col>
          <Col flex={'auto'}>
            <Card
              size={'small'}
              title={'Current limits status'}
              extra={
                <Button onClick={(): void => setIsTagLimitsDrawerOpened(true)} size={'small'}>
                  Update limits
                </Button>
              }
            >
              <Row>
                {tagLimitsStatuses.length ? (
                  <>
                    <Col flex={'auto'}>
                      <List className={styles.tagLimitWarningsList} size={'small'}>
                        {tagLimitsStatuses.map((tagLimitStatus) => {
                          const tagLabel = tagLimitStatus.getTagLabel();

                          return (
                            <List.Item key={tagLimitStatus.tagId} title={tagLabel}>
                              <Col span={4}>
                                <Text>{tagLabel}</Text>
                              </Col>
                              <Col span={8}>
                                <Progress
                                  strokeColor={tagLimitStatus.hasLimitBeenReached ? 'orange' : 'normal'}
                                  size={'small'}
                                  success={{
                                    percent: -1,
                                  }}
                                  format={(): ReactNode => `${tagLimitStatus.limitAchievementPercent.toFixed(1)}%`}
                                  percent={tagLimitStatus.limitAchievementPercent}
                                  type={'line'}
                                />
                              </Col>
                              <Col span={5}>
                                <Text>
                                  {`${tagLimitStatus.currentOperationsSum.toFixed(CURRENCY_PRECISION)}
                                  / ${tagLimitStatus.operationSumLimit?.toFixed(CURRENCY_PRECISION)} BYN`}
                                </Text>
                              </Col>
                            </List.Item>
                          );
                        })}
                      </List>
                    </Col>
                    <Col>
                      <Divider className={styles.tagLimitsBlockDivider} type={'vertical'} />
                    </Col>
                  </>
                ) : (
                  <></>
                )}
                {/* eslint-disable-next-line no-magic-numbers */}
                <Col span={!tagLimitsStatuses.length ? 24 : 6}>
                  <Result
                    className={styles.tagLimitsResult}
                    status={tagLimitsStatuses.length ? 'warning' : 'success'}
                    title={tagLimitsStatuses.length ? 'Attention needed' : 'No attention needed'}
                    subTitle={tagLimitsResultTitle}
                  />
                </Col>
              </Row>
              <TagLimitsDrawer
                open={isTagLimitsDrawerOpened}
                initialTagLimitsData={tagLimits}
                budgetTags={budgetTags}
                onClose={onTagLimitsDrawerClose}
                onSubmit={onTagLimitsDrawerSubmit}
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
                          <Card size={'small'} title="Budget limits by tags">
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
                setBudgetTags={setBudgetTags}
                onNewTagAdded={onNewTagAdded}
                triggerAnalyticStatsRecalculation={fetchAnalyticData}
                triggerTagLimitsDataLoading={loadTagLimitsData}
                budgetTags={budgetTags ?? []}
                budgetId={toNumber(id)}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
});

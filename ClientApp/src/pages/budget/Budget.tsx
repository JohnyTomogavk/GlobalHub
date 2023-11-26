import React, { ReactNode, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Empty,
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

import { isEqual, toNumber } from 'lodash';
import { BudgetDto } from '../../dto/budgets/budgetDto';
import { EditOutlined } from '@ant-design/icons';
import { ItemInfoSubHeader } from '../../components/itemInfoHeader/ItemInfoHeader';
import Paragraph from 'antd/es/typography/Paragraph';
import { BudgetAnalyticDto } from '../../dto/budgets/budgetAnalyticDto';
import { TagDto } from '../../dto/tags/tagDto';
import { BudgetItemsTable } from './budgetItemsTable/BudgetItemsTable';
import { ExpensesDistributionByDaysChart } from './analyticCharts/ExpensesDistributionByDaysChart';
import { TagLimitsStateBulletChart } from './analyticCharts/TagLimitsStateBulletChart';
import { ExpensesByTagsChart } from './analyticCharts/ExpensesByTagsChart';
import { BUDGET_LIST_ROUTE } from '../../constants/routingConstants';
import { HttpStatusCode } from 'axios';
import { observer } from 'mobx-react-lite';
import SideMenuIndexStore from '../../store/sideMenu/sideMenuIndexStore';
import { PreserveControl } from './preserveControl/PreserveControl';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import { TagLimitDto } from '../../dto/tagLimit/tagLimitDto';
import { ExpenseOperationsSumDto } from '../../dto/budgetItems/expenseOperationsSumDto';
import {
  CURRENCY_PRECISION,
  PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING,
} from '../../constants/budgetConstants';
import { TagLimitsDrawer } from './tagLimitsDrawer/TagLimitsDrawer';
import { ResultStatusType } from 'antd/lib/result';
import useTagsApi from '../../hooks/api/useTagsApi';
import useBudgetsApi from '../../hooks/api/useBudgetsApi';
import useBudgetsItemsApi from '../../hooks/api/useBudgetsItemsApi';
import useTagLimitsApi from '../../hooks/api/useTagLimitsApi';

const { Text } = Typography;

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
  const tagsApi = useTagsApi();
  const budgetsApi = useBudgetsApi();
  const budgetItemsApi = useBudgetsItemsApi();
  const tagLimitsApi = useTagLimitsApi();

  const [tagLimits, setTagLimits] = useState<TagLimitDto[]>([]);
  const [expenseSumsGroupedByTags, setExpenseSumsGroupedByTags] = useState<ExpenseOperationsSumDto[]>([]);
  const [tagLimitsStatuses, setTagLimitsStatuses] = useState<TagLimitStatus[]>([]);
  const [isTagLimitsDrawerOpened, setIsTagLimitsDrawerOpened] = useState<boolean>(false);

  const notEmptyExpenseSumsGroupedByTags: ExpenseOperationsSumDto[] = expenseSumsGroupedByTags.filter(
    (operationSum: ExpenseOperationsSumDto): boolean => operationSum.operationsSum !== 0
  );

  const loadBudgetData = async (): Promise<void> => {
    const [{ data: budget }, { data: budgetAnalytic }, { data: tags }] = await Promise.all([
      budgetsApi.getById(budgetId),
      budgetsApi.getAnalyticById(budgetId),
      tagsApi.getTags(budgetId),
    ]);

    setBudgetDto(budget);
    setBudgetAnalyticData(budgetAnalytic);
    setBudgetTags(tags);
  };

  const getTagLimitsResultTitle = (): string => {
    let resultTitle = 'You are on track with your limits';

    if (tagLimitsStatuses.some((status) => status.hasLimitBeenReached)) {
      resultTitle = `Some of tags have reached their limits on expenses: ${tagLimitsStatuses
        .filter((status) => status.hasLimitBeenReached)
        .map((limitStatus) => limitStatus.getTagLabel())
        .join(', ')}`;
    } else if (tagLimitsStatuses.some((status) => !status.hasLimitBeenReached)) {
      resultTitle = `Some of tags are about to reach their limits on expenses: ${tagLimitsStatuses
        .filter((status) => !status.hasLimitBeenReached)
        .map((limitStatus) => limitStatus.getTagLabel())
        .join(', ')}`;
    }

    return resultTitle;
  };

  const getTagLimitResultStatus = (): ResultStatusType => {
    let status: ResultStatusType = 'success';

    if (tagLimitsStatuses.some((tagLimitStatus) => tagLimitStatus.hasLimitBeenReached)) {
      status = 'error';
    } else if (tagLimitsStatuses.some((tagLimitStatus) => !tagLimitStatus.hasLimitBeenReached)) {
      status = 'warning';
    }

    return status;
  };

  const handleExpenseLimits = (): void => {
    if (!tagLimits.length) return;

    let tagLimitsWarnings: TagLimitStatus[] = [];

    expenseSumsGroupedByTags.map((expenseOperationsSum) => {
      const limitForSum = tagLimits.find((limit) => limit.id === expenseOperationsSum.tagId);

      if (!limitForSum) return;

      let hasLimitBeenReached: boolean;

      if (expenseOperationsSum.operationsSum >= limitForSum.maxExpenseOperationsSum) {
        hasLimitBeenReached = true;
      } else if (
        expenseOperationsSum.operationsSum * (1 + PERCENT_LEFT_BEFORE_REACHING_TAG_LIMIT_TO_SHOW_WARNING) >=
        limitForSum.maxExpenseOperationsSum
      ) {
        hasLimitBeenReached = false;
      } else {
        return;
      }

      const limitAchievementRatio = expenseOperationsSum.operationsSum / limitForSum.maxExpenseOperationsSum;

      const getTagLabel = (): string =>
        budgetTags.find((tag) => tag.id === expenseOperationsSum.tagId)?.label ?? 'Unknown';

      tagLimitsWarnings.push({
        tagId: expenseOperationsSum.tagId,
        getTagLabel: getTagLabel,
        hasLimitBeenReached: hasLimitBeenReached,
        operationSumLimit: limitForSum.maxExpenseOperationsSum,
        currentOperationsSum: expenseOperationsSum.operationsSum,
        limitAchievementPercent: limitAchievementRatio * CONVERT_TO_PERCENT_RATIO,
      });
    });

    tagLimitsWarnings = tagLimitsWarnings.sort((a, b) => b.limitAchievementPercent - a.limitAchievementPercent);
    setTagLimitsStatuses(tagLimitsWarnings);
  };

  const loadTagLimitsData = async (): Promise<void> => {
    const [{ data: tagLimitsDtos, status: tagLimitsStatus }, { data: expSumsGroupedByTags, status: expSumsStatus }] =
      await Promise.all([tagLimitsApi.getLimits(budgetId), budgetItemsApi.getExpensesSumsGroupedByTags(budgetId)]);

    setTagLimits(tagLimitsStatus === HttpStatusCode.Ok ? tagLimitsDtos : []);
    setExpenseSumsGroupedByTags(expSumsStatus === HttpStatusCode.Ok ? expSumsGroupedByTags : []);
  };

  useEffect(() => {
    loadTagLimitsData();
    loadBudgetData();

    return () => {
      setTagLimitsStatuses([]);
    };
  }, [id]);

  useEffect(() => {
    handleExpenseLimits();
  }, [budgetTags, expenseSumsGroupedByTags, tagLimits]);

  const onBudgetTitleUpdate = async (title: string): Promise<void> => {
    if (!id) return;

    const parsedId = toNumber(id);

    const response = await budgetsApi.updateTitle(parsedId, title);
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

    const response = await budgetsApi.updateDescription(toNumber(id), description);
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

    const { data: analyticData } = await budgetsApi.getAnalyticById(toNumber(id));
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

    const { data: updatedBudget, status } = await budgetsApi.updatePreservePercent(toNumber(id), newPercentValue);

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
    setIsTagLimitsDrawerOpened(false);

    if (isEqual(updatedTagLimits, tagLimits)) return;

    const { status } = await tagLimitsApi.updateLimits(budgetId, updatedTagLimits);

    if (status === HttpStatusCode.Ok) {
      await loadTagLimitsData();
    }
  };

  return (
    <>
      <ItemInfoSubHeader
        onDeleteCallback={async (): Promise<void> => {
          if (!id) return;

          const parsedId = toNumber(id);
          const { status } = await budgetsApi.delete(parsedId);

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
                  <Statistic title="Left" suffix={'BYN'} value={budgetAnalyticData?.moneyLeft} />
                  <Statistic title="Irregular Expenses" suffix={'BYN'} value={budgetAnalyticData?.irregularExpenses} />
                </Space>
                <Space direction={'vertical'}>
                  <Statistic title="Preserved" suffix={'BYN'} value={budgetAnalyticData?.moneyPreserved} />
                  <Statistic title="Regular expenses" suffix={'BYN'} value={budgetAnalyticData?.regularExpenses} />
                </Space>
              </Space>
            </Card>
          </Col>
          <Col flex={'auto'}>
            <Card size={'small'} title={'Operations analytic'} className={styles.card}>
              <Space direction={'vertical'}>
                <Statistic value={budgetAnalyticData?.averageDailyExpenses} title="Avg daily expenses" suffix={'BYN'} />
                <Statistic value={budgetAnalyticData?.expensesMedian} title="Expenses median" suffix={'BYN'} />
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
                                  strokeColor={tagLimitStatus.hasLimitBeenReached ? 'red' : 'orange'}
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
                    status={getTagLimitResultStatus()}
                    title={tagLimitsStatuses.length ? 'Attention needed' : 'No attention needed'}
                    subTitle={getTagLimitsResultTitle()}
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
                destroyInactivePanel={false}
                size={'small'}
                items={[
                  {
                    key: 1,
                    label: 'Analytic by tags',
                    children: budgetTags.length ? (
                      // eslint-disable-next-line no-magic-numbers
                      <Row gutter={[8, 8]}>
                        <Col flex={'auto'}>
                          <Card size={'small'} title="Budget limits by tags">
                            <TagLimitsStateBulletChart
                              tags={budgetTags}
                              expensesByTagSums={expenseSumsGroupedByTags}
                              tagLimitsData={tagLimits}
                            />
                          </Card>
                        </Col>
                        {notEmptyExpenseSumsGroupedByTags.length ? (
                          <Col flex={'auto'}>
                            <Card size={'small'} title="Expenses by tags">
                              <ExpensesByTagsChart
                                tags={budgetTags}
                                tagExpensesSums={notEmptyExpenseSumsGroupedByTags}
                              />
                            </Card>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                    ) : (
                      <Empty description={'Cant perform analytic on tags because there are no tags created'} />
                    ),
                  },
                  {
                    key: 2,
                    destroyInactivePanel: true,
                    label: 'Current month expenses to previous',
                    children: <ExpensesDistributionByDaysChart budgetId={budgetId} />,
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

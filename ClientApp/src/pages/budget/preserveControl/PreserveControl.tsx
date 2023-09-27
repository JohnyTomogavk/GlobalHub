import { Button, Progress, Space, Tooltip } from 'antd';
import { MinusOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

interface PreserveControlProps {
  preserveFromIncomingPercent: number;
  isValueEditable: boolean;
  onValueUpdated: (newPercentValue: number) => Promise<void>;
}

const preservePercentChangeStep = 5;
const maxPercentValue = 100;
const minPercentValue = 0;

export const PreserveControl = ({
  preserveFromIncomingPercent,
  isValueEditable,
  onValueUpdated,
}: PreserveControlProps): JSX.Element => {
  const [editablePercentValue, setEditablePercentValue] = useState(preserveFromIncomingPercent);

  useEffect(() => {
    setEditablePercentValue(preserveFromIncomingPercent);
  }, [preserveFromIncomingPercent, isValueEditable]);

  const onPercentSave = async (): Promise<void> => {
    if (preserveFromIncomingPercent !== editablePercentValue) {
      await onValueUpdated(editablePercentValue);
    }
  };

  const onValueIncrease = (): void => {
    setEditablePercentValue((prevState) => {
      const newValue = prevState + preservePercentChangeStep;

      return newValue > maxPercentValue ? maxPercentValue : newValue;
    });
  };

  const onValueDecrease = (): void => {
    setEditablePercentValue((prevState) => {
      const newValue = prevState - preservePercentChangeStep;

      return newValue < minPercentValue ? minPercentValue : newValue;
    });
  };

  return (
    <Space direction="vertical" align="center">
      <Tooltip placement={'right'} title="Preserved from incoming">
        <Progress
          type="circle"
          success={{
            percent: -1,
          }}
          percent={isValueEditable ? editablePercentValue : preserveFromIncomingPercent}
        />
      </Tooltip>
      {isValueEditable ? (
        <Button.Group>
          <Button icon={<MinusOutlined />} onClick={onValueDecrease} />
          <Button icon={<PlusOutlined />} onClick={onValueIncrease} />
          <Button type={'primary'} icon={<SaveOutlined />} onClick={onPercentSave}>
            Save
          </Button>
        </Button.Group>
      ) : (
        <></>
      )}
    </Space>
  );
};

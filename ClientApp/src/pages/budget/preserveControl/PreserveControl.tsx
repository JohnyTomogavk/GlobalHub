import { Button, Progress, Space, Tooltip } from 'antd';
import { MinusOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

interface PreserveControlProps {
  preserveFromIncomingPercent: number;
  isValueEditable: boolean;
  onValueUpdated: (newPercentValue: number) => Promise<void>;
}

const preservePercentChangeStep = 5;

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
    await onValueUpdated(editablePercentValue);
  };

  return (
    <Space direction="vertical" align="center">
      <Tooltip placement={'right'} title="Preserved from incoming">
        <Progress type="dashboard" percent={isValueEditable ? editablePercentValue : preserveFromIncomingPercent} />
      </Tooltip>
      {isValueEditable ? (
        <Button.Group>
          <Button
            icon={<MinusOutlined />}
            onClick={(): void => setEditablePercentValue((prevState) => prevState - preservePercentChangeStep)}
          />
          <Button
            icon={<PlusOutlined />}
            onClick={(): void => setEditablePercentValue((prevState) => prevState + preservePercentChangeStep)}
          />
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

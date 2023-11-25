import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './loader.module.scss';
import { SpinSize } from 'antd/lib/spin';

interface ILoaderProps {
  size?: SpinSize;
}

export const Loader = ({ size }: ILoaderProps): JSX.Element => (
  <Spin size={size ?? 'default'} className={styles.loader} indicator={<LoadingOutlined spin />} />
);

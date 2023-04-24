import React from 'react';
import { Footer } from 'antd/es/layout/layout';
import styles from './Footer.module.scss';

export const AppFooter = (): JSX.Element => (
  <Footer className={styles.footer}>
    ©2023 Tomogavk Ltd. | All Rights Reserved
  </Footer>
);

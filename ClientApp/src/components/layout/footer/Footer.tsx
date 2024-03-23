import React from 'react';
import { Footer } from 'antd/es/layout/layout';
import styles from './Footer.module.scss';

export const AppFooter = (): JSX.Element => {
  const copyright = '©2024 Tomogavk Solutions | All Rights Reserved';

  return <Footer className={styles.footer}>{copyright}</Footer>;
};

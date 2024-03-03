import { ReactNode } from 'react';

export interface NotificationModel {
  id: string;
  message: string;
  description: string;
  receivedDate: Date;
  icon: ReactNode;
  hasBeenViewed: boolean;
}

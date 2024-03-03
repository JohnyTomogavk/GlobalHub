import { NotificationBase } from './notificationBase';

export interface OnEventStartedNotification extends NotificationBase {
  projectId: number;
  projectItemId: number;
  projectTitle: string;
  projectItemTitle: string;
  eventStartDate: Date;
}

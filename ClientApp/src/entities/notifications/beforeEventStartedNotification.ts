import { NotificationBase } from './notificationBase';

export interface BeforeEventStartedNotification extends NotificationBase {
  projectId: number;
  projectItemId: number;
  projectTitle: string;
  projectItemTitle: string;
  eventStartDate: Date;
}

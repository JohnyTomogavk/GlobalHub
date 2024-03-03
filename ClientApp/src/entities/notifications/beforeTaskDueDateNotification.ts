import { NotificationBase } from './notificationBase';

export interface BeforeTaskDueDateNotification extends NotificationBase {
  projectId: number;
  projectItemId: number;
  projectTitle: string;
  projectItemTitle: string;
  dueDate: Date;
}

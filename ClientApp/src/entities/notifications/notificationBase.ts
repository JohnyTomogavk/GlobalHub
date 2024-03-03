import { EEventType } from '../../enums/notifications/EEventType';

export interface NotificationBase {
  id: string;
  eventType: EEventType;
  hasBeenViewed: boolean;
  recipientId: string;
  dateReceived: Date;
}

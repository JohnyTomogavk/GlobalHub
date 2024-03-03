import useAxios from './useAxios';
import { NotificationBase } from '../../entities/notifications/notificationBase';
import { getResourceUrl } from '../../helpers/urlHelper';
import { GET_USER_NOTIFICATIONS, NOTIFICATIONS_API_SUFFIX } from '../../constants/apiConstants';
import { AxiosResponse } from 'axios';

interface INotificationsApi {
  getUserNotifications: () => Promise<AxiosResponse<NotificationBase[]>>;
}

const useNotificationsApi = (): INotificationsApi => {
  const { httpGet } = useAxios();

  return {
    getUserNotifications: (): Promise<AxiosResponse<NotificationBase[]>> => {
      const url = getResourceUrl(NOTIFICATIONS_API_SUFFIX, GET_USER_NOTIFICATIONS);

      return httpGet(url);
    },
  };
};

export default useNotificationsApi;

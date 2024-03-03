import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { API_GATEWAY_BASE } from '../../constants/apiConstants';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';

const getHubConnection = (accessToken?: string): HubConnection => {
  const connection = new HubConnectionBuilder()
    .withUrl(`${API_GATEWAY_BASE}/notifications-api/hubs/notifications`, {
      accessTokenFactory(): string | Promise<string> {
        return accessToken ?? '';
      },
      transport: HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .build();

  connection.start();

  return connection;
};

const useNotificationsHubConnection = (): {
  notificationHub: HubConnection | null;
} => {
  const auth = useAuth();
  const [notificationHubConnection, setNotificationHubConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (notificationHubConnection !== null) return;

    setNotificationHubConnection(getHubConnection(auth.user?.access_token));
  }, [notificationHubConnection]);

  return {
    notificationHub: notificationHubConnection,
  };
};

export default useNotificationsHubConnection;

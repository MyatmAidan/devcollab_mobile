import { IonButton } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { acceptRequest, cancelRequest, rejectRequest, sendConnectionRequest } from '../api/connectionApi';
import type { ConnectionStatus } from '../types/developer';
import { hapticLight, hapticSuccess } from '../utils/haptics';

interface ConnectActionProps {
  userId: string;
  status?: ConnectionStatus;
  connectionRequestId?: string | null;
  conversationId?: string | null;
  onStatusChange?: () => void;
  size?: 'small' | 'default';
  expand?: boolean;
}

const ConnectAction: React.FC<ConnectActionProps> = ({
  userId,
  status = 'none',
  connectionRequestId,
  conversationId,
  onStatusChange,
  size = 'small',
  expand = false,
}) => {
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  const run = async (action: () => Promise<unknown>, haptic = hapticLight) => {
    void haptic();
    setLoading(true);
    try {
      await action();
      onStatusChange?.();
    } finally {
      setLoading(false);
    }
  };

  if (status === 'self') return null;

  if (status === 'connected' && conversationId) {
    return (
      <IonButton
        size={size}
        expand={expand ? 'block' : undefined}
        color="primary"
        onClick={() => {
          void hapticLight();
          history.push(`/chat/${conversationId}`);
        }}
      >
        Message
      </IonButton>
    );
  }

  if (status === 'pending_sent') {
    return (
      <IonButton
        size={size}
        expand={expand ? 'block' : undefined}
        fill="outline"
        color="medium"
        disabled={loading || !connectionRequestId}
        onClick={() => connectionRequestId && run(() => cancelRequest(connectionRequestId))}
      >
        {loading ? 'Cancelling...' : 'Pending'}
      </IonButton>
    );
  }

  if (status === 'pending_received' && connectionRequestId) {
    return (
      <>
        <IonButton
          size={size}
          color="primary"
          disabled={loading}
          onClick={() => run(async () => {
            const connection = await acceptRequest(connectionRequestId);
            void hapticSuccess();
            if (connection.conversation?.id) {
              history.push(`/chat/${connection.conversation.id}`);
            }
          }, hapticLight)}
        >
          Accept
        </IonButton>
        <IonButton
          size={size}
          fill="outline"
          color="medium"
          disabled={loading}
          onClick={() => run(() => rejectRequest(connectionRequestId))}
        >
          Decline
        </IonButton>
      </>
    );
  }

  return (
    <IonButton
      size={size}
      expand={expand ? 'block' : undefined}
      disabled={loading}
      onClick={() => run(() => sendConnectionRequest({
        receiver_id: userId,
        message: 'Hi! Would you like to connect on DevCollab?',
      }))}
    >
      {loading ? 'Sending...' : 'Connect'}
    </IonButton>
  );
};

export default ConnectAction;

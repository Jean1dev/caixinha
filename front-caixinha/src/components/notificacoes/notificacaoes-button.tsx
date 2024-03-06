import { useCallback, useMemo, useState, useEffect } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import { usePopover } from '@/hooks/usePopover';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationsPopover } from './notificacoes-popover';
import useSocket from '@/hooks/useSocket';
import { useUserAuth } from '@/hooks/useUserAuth';
import { marcarNotificactionsComoLida } from '@/pages/api/api.service';

interface NotificationType {
  id: string
  createdAt: string
  description: string
  read: boolean
  type: 'new_feature' | 'user_info'
  user: string
}

const useNotifications = () => {
  const { user } = useUserAuth()
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const { socket, connected } = useSocket('my_notifications', (data) => {

    if (data.type && data.type === 'MyNotificationsResponse') {
      if (data.payload) {
        setNotifications(data.payload)
      }
    }

  })

  useEffect(() => {
    console.log('connected', connected, 'socket.readyState', socket.readyState)
    if (connected && socket.readyState > 0) {

      socket.send(JSON.stringify({
        type: 'my_notifications',
        payload: {}
      }))
    }

  }, [socket, connected])

  const unread = useMemo(() => {
    return notifications.reduce((acc, notification) => acc + (notification.read ? 0 : 1), 0);
  }, [notifications]);

  const handleRemoveOne = useCallback((notificationId: any) => {
    setNotifications((prevState) => {
      return prevState.filter((notification) => notification.id !== notificationId);
    });

    marcarNotificactionsComoLida({
      all: false,
      ids: [notificationId],
      user: user.email
    }).then(() => { console.log('marcarNotificactionsComoLida', 'ok') })
  }, [user.email]);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prevState) => {
      return prevState.map((notification) => ({
        ...notification,
        read: true
      }));
    });

    marcarNotificactionsComoLida({
      all: true,
      user: user.email
    }).then(() => { console.log('marcarNotificactionsComoLida', 'ok') })
  }, [user.email]);

  return {
    handleMarkAllAsRead,
    handleRemoveOne,
    notifications,
    unread
  };
};

export const NotificationsButton = () => {
  const popover = usePopover();
  const { handleRemoveOne, handleMarkAllAsRead, notifications, unread } = useNotifications();

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          ref={popover.anchorRef}
          onClick={popover.handleOpen}
        >
          <Badge
            color="error"
            badgeContent={unread}
          >
            <SvgIcon>
              <NotificationsIcon />
            </SvgIcon>
          </Badge>
        </IconButton>
      </Tooltip>
      <NotificationsPopover
        anchorEl={popover.anchorRef.current}
        notifications={notifications}
        onClose={popover.handleClose}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRemoveOne={handleRemoveOne}
        open={popover.open}
      />
    </>
  );
};

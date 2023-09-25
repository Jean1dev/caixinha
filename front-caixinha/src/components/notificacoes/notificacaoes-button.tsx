import { useCallback, useMemo, useState } from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import { usePopover } from '@/hooks/usePopover';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationsPopover } from './notificacoes-popover';
import useSocket from '@/hooks/useSocket';

interface NotificationType {
  id: string
  createdAt: string
  description: string
  read: boolean
  type: 'new_feature' | 'job_add'
}

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const socket = useSocket('my_notifications', () => {
    console.log('my_notifications')
  })

  const unread = useMemo(() => {
    return notifications.reduce((acc, notification) => acc + (notification.read ? 0 : 1), 0);
  }, [notifications]);

  const handleRemoveOne = useCallback((notificationId: any) => {
    setNotifications((prevState) => {
      return prevState.filter((notification) => notification.id !== notificationId);
    });
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    socket.send(JSON.stringify({
      type: 'simple_message',
      payload: ['isso', 'e', 'um', 'teste']
    }))
    setNotifications((prevState) => {
      return prevState.map((notification) => ({
        ...notification,
        read: true
      }));
    });
  }, [socket]);

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
